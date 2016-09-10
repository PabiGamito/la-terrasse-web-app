require "rubygems"
require "bundler/setup"
require "sinatra"
require "json"
require "bcrypt"
require "pony"
require "time"
require "phonelib"
require "pry"
require File.join(File.dirname(__FILE__), "environment")

# TODO: If lots of traffic, instead of saving user cart data on server, save locally with IndexedDB
# TODO: Add phone number validation, https://github.com/daddyz/phonelib

configure do
  set :views, "#{File.dirname(__FILE__)}/views"
  set :server, 'webrick'
  set :show_exceptions, :after_handler
end

configure :production, :development do
  enable :logging
  enable :sessions
end

helpers do

  def to_boolean(str)
    str.downcase == 'true'
  end

  def object_to_hash(object)
    hash = {}
    object.instance_variables.each {|var| hash[var.to_s.delete("@")] = object.instance_variable_get(var) }
    return hash
  end

  def get_user
    if session[:user_id] != nil && User.count(id: session[:user_id].to_i) > 0
      user = User.get(session[:user_id].to_i)
    elsif User.count(ip: request.ip) > 0
      user = User.first(ip: request.ip)
      session[:user_id] = user.id
    else
      user = User.create(ip: request.ip)
      session[:user_id] = user.id
    end
    return user
  end

  def set_salt(user)
    if user.salt == nil
      salt = BCrypt::Engine.generate_salt
      user.update(salt: salt)
    end
  end

  def user_hash(user)
    return BCrypt::Engine.hash_secret(user.email, user.salt)
  end

  def transfer_orders(order_holder, new_order_holder)
    order = CombinedOrder.first(user_id: order_holder.id)
    order.update(user_id: new_order_holder.id)
  end

  def stack_orders(orders)
    # sort orders by product_id
    orders.sort! { |a,b| a.product_id.to_i <=> b.product_id.to_i }
    stacked_orders = []
    index = 0
    amount = 0
    orders.each do |order|
      index += 1
      amount += 1
      # orders[index] = next order | index = orders.length = last in list
      if index < orders.length
        if order.product_id != orders[index].product_id
          dup_order = order.dup
          dup_order.class.module_eval { attr_accessor :amount}
          dup_order.amount = amount
          stacked_orders << dup_order
          amount = 0
        end
      elsif index = orders.length
        dup_order = order.dup
        dup_order.class.module_eval { attr_accessor :amount}
        dup_order.amount = amount
        stacked_orders << dup_order
      end
    end
    return stacked_orders # Array with orders objects with added amount attribute
  end

  def send_confirmation_email(user, confirmation_link, account_modification_link, orders)
    @user = user
    @confirmation_link = confirmation_link
    @account_modification_link = account_modification_link
    @orders = stack_orders(orders)
    Pony.mail(
      :to => user.email,
      :subject => 'Confirmer la Commande',
      :html_body => erb(:email_confirmation, :layout => false),
      # User body incase mail client can't read html
      :body => "Please click the following link to confirm your order: #{@confirmation_link}"
    )
  end

  def send_order_recap(user, combined_order_id)
    @orders = stack_orders( Order.all(combined_order_id: combined_order_id) )
  end

  def admin_logged_in?
    Admin.get(session[:admin_id]) != nil
  end

end

# ROOT/HOME/INDEX PAGE
get "/" do

  @title = "La Terrasse de Saint Germain au mont d'Or : Restaurant Brasserie Pizzeria"
  @description = "Jean-Marc vous accueille dans son restaurant à deux pas de Lyon en mode Terrasse, Brasserie ou Pizzeria. Pizzas à emporter à Saint Germain au Mont d'Or"

  @products = Product.all
  @user = get_user
  @orders = stack_orders( Order.all(user_id: @user.id, submitted: false) )

  erb :root
end

# UPDATING CART
post "/update-cart" do
  action = params[:action]
  product_id = params[:product_id].to_i
  amount = params[:amount].to_i
  user = get_user

  if CombinedOrder.count(user_id: user.id, submitted: false) == 0
    combined_order = CombinedOrder.create(user_id: user.id)
  else
    combined_order = CombinedOrder.first(user_id: user.id, submitted: false)
  end

  if action == "add" && amount != 0
    if Order.count(user_id: user.id, product_id: product_id, submitted: false) == 0
      amount.times do
        Order.create(user_id: user.id, product_id: product_id, combined_order_id: combined_order.id)
      end
    else
      action = "update"
    end
  elsif action == "remove"
    orders = Order.all(user_id: user.id, product_id: product_id, submitted: false)
    orders.destroy
  end

  if action == "update" && amount != 0
    orders = Order.all(user_id: user.id, product_id: product_id, submitted: false)
    if amount > orders.length
      (amount - orders.length).times do
        Order.create(user_id: user.id, product_id: product_id, combined_order_id: combined_order.id)
      end
    elsif amount < orders.length
      i = 0
      (orders.length - amount).times do
        orders[i].destroy
        i += 1
      end
    end
  end

  @orders = stack_orders( Order.all(user_id: user.id, submitted: false) )
  erb :cart, :layout => false

end

# SEND CONTACT EMAIL
post "send-contact-email" do
  contact_email = "jmschirrmeister@aol.com"
  Pony.mail(
    :from => params[:email],
    :to => contact_email,
    :subject => params[:subjet],
    :body => "De: #{params[:name]}\n\n#{params[:message]}"
  )
end


# ######## #
# ORDERING #
# ######## #

# LOAD PAGE TO SUBMIT ORDER
get "/order" do
  @user = get_user
  @orders = stack_orders( Order.all(user_id: @user.id, submitted: false) )
  erb :order, :layout => false
end

# SUBMIT ORDER
post "/order" do # params: first_order, email, name, phone
  content_type :json
  user = get_user
  email = params[:email].downcase # README: Although emails are case sensitive, we will consider that they aren't
  pickup_time = " #{params[:pickup_time]}:00 "
  pickup_time = Time.now.to_s.sub(/ (.*?) /, pickup_time)
  pickup_time = Time.parse(pickup_time)
  first_order = to_boolean(params[:first_order])

  if Time.now <= pickup_time + 15*60 # if pickup time is in the past
    pickup_time = Time.now + 15*60
  end

  open_time_range = Range.new(
    Time.local(pickup_time.year, pickup_time.month, pickup_time.day, 18, 45),
    Time.local(pickup_time.year, pickup_time.month, pickup_time.day, 21, 45)
  )
  unless open_time_range === pickup_time
    if Time.now > Time.parse("21:30")
      pickup_time = Time.parse("18:45") + 60*60*24
    else
      pickup_time = Time.parse("18:45")
    end
  end

  # Check time is between order open times
  t = Time.now
  open_time_range = Range.new(
    Time.local(t.year, t.month, t.day, 18, 30),
    Time.local(t.year, t.month, t.day, 21, 30)
  )

  unless open_time_range === t
    error = "not open for orders" #TODO: Send warning message asking if user still wishes to order
    return {success: false, error: error, error_id: 1, first_order: first_order}.to_json
  end

  if email.match(/(.)+\@+(.)+(\.+)(.)+/i) == nil # Email format invalid
    error = "invalid email address"
    return {success: false, error: error, error_id: 2, first_order: first_order}.to_json
  end

  if first_order # User says it's his first time ordering
    if params[:first_name] == nil || params[:last_name] == nil || params[:phone] == nil || params[:first_name] == "" || params[:last_name] == "" || params[:phone] == "" # if a required parameter is empty
      error = "one or more required parameters are empty"
      return {success: false, error: error, error_id: 3, first_order: first_order}.to_json
    end
    if Phonelib.valid?(params[:phone])
      phone = Phonelib.parse(params[:phone]).sanitized.to_i
    else
      error = "Phone number not valid"
      return {success: false, error: error, error_id: 8, first_order: first_order}.to_json
    end
    if User.count(email: email) == 0 # if no user is saved with this email
      if user.email == nil # if user saved in session has no email data
        user.update(
          email: email,
          first_name: params[:first_name].downcase,
          last_name: params[:last_name].downcase,
          phone: phone
        )
      else # if user saved in session already has email data
        user = User.create(
          ip: request.ip,
          email: email,
          first_name: params[:first_name].downcase,
          last_name: params[:last_name].downcase,
          phone: phone
        )
        session[:user_id] = user.id
      end
    else # if a user with this email already exists
      user = User.first(email: email)
      if Order.count(user_id: user.id, confirmed: true) == 0 || user.first_name == nil || user.last_name == nil || user.phone == nil # if user with this email has never ordered stuff yet or has missing info
        user.update(
          ip: request.ip,
          first_name: params[:first_name].downcase,
          last_name: params[:last_name].downcase,
          phone: phone
        )
        session[:user_id] = user.id
      elsif user.first_name == params[:first_name].downcase && user.last_name == params[:last_name].downcase && user.phone == phone # if all user data matches
        user.update(ip: request.ip)
        session[:user_id] = user.id
      else # if user with this email has already ordered stuff & new data doesn't match old data
        error = "that email is already associated with an account, you probably already ordered here"
        return {success: false, error: error, error_id: 4, first_order: first_order}.to_json
      end
    end

  else # If user says it isn't his first time ordering
    if user.email != email && User.count(email: email) > 0 # If the sessioned user's email doesn't match the users email but a user exists with the email
      new_user = User.first(email: email)
      if new_user.first_name == nil || new_user.last_name == nil || new_user.phone == nil # If user with this email has missing information
        error = "you are missing contact detail, please submit form as a new user"
        return {success: false, error: error, error_id: 5, first_order: first_order}.to_json
      end
      transfer_orders(user, new_user)
      if user.email == nil # If sessioned user has no recorded email = has no orders
        user.destroy
      end
      user = new_user
      user.update(ip: request.ip)
      session[:user_id] = user.id
    elsif user.email != email && User.count(email: email) == 0 # If sessioned user doesn't has this email but no other account has this email either
      error = "no record of user found with that email"
      return {success: false, error: error, error_id: 6, first_order: first_order}.to_json
    elsif user.email == email # If sessioned user matches this email
      if user.first_name == nil || user.last_name == nil || user.phone == nil # If user with this email has missing information
        error = "you are missing contact detail, please submit form as a new user"
        return {success: false, error: error, error_id: 5, first_order: first_order}.to_json
      end
    end
  end

  combined_order = CombinedOrder.first(user_id: user.id, submitted: false)
  if !combined_order
    error = "order is empty or already sent : check your email or resubmit an order"
    return {success: false, error: error, error_id: 7, first_order: first_order}.to_json
  end

  orders = Order.all(user_id: user.id, submitted: false, combined_order_id: combined_order.id)
  if orders.length == 0
    error = "order is empty or already sent : check your email or resubmit an order"
    return {success: false, error: error, error_id: 7, first_order: first_order}.to_json
  end

  set_salt(user)
  hash = user_hash(user)

  time = Time.now

  if request.ssl?
    http = "https"
  else
    http = "http"
  end
  confirmation_link = "#{http}://#{request.host}:#{request.port}/email-confirmation?email=#{user.email}&ts=#{time.to_i}&hash=#{hash}"
  account_modification_link = "#{request.host}:#{request.port}/update-account?email=#{user.email}&hash=#{hash}"

  send_confirmation_email(user, confirmation_link, account_modification_link, orders)

  # README: Keep at end, so order only changes to submitted if everything else runs correctly
  orders.each do |order|
    order.update(submitted: true)
  end
  combined_order.update(submitted: true, submitted_at: time, pickup_time: pickup_time)

  mail_domain = user.email.match(/\@(.*)(?=\.)/)[1] # me@gmail.com => gmail
  if mail_domain == "gmail"
    mail_client_link = "https://www.gmail.com"
  else
    mail_client_link = "mail_to:"
  end
  return {success: true, mail_domain: mail_client_link}.to_json
end

# CHECKOUT
post "/checkout" do
  user = get_user
  # Get the credit card details submitted by the form
  token = params[:stripeToken]
  # Create a Customer
  customer = Stripe::Customer.create(
    :source => token,
    :description => "#{user.first_name.capitalize} #{user.last_name.capitalize}"
  )
  # Save stripe customer id to database
  user.update(stripe_id: customer.id)
end

# GET ORDER INVOICE
get "/invoice" do
  email = params[:email]
  user = User.first(email: email)
  if user_hash(user) == params[:hash]
    submitted_time = Time.at(params[:ts].to_i)
    @combined_order = CombinedOrder.first(user_id: user.id, submitted_at: submitted_time)
    @orders = stack_orders( Order.all(combined_order_id: @combined_order.id) )
    if @orders.length > 0
      return erb :invoice, :layout => false
    end
  end

  redirect '/'
end

# CONFIRM EMAIL
get "/email-confirmation" do
  user = User.first(email: params[:email])
  submitted_time = Time.at(params[:ts].to_i)
  hash = params[:hash]

  if hash == user_hash(user) && submitted_time + 60*60*24 > Time.now
    @success = true
    combined_order = CombinedOrder.first(user_id: user.id, submitted: true, submitted_at: submitted_time, confirmed: false)
    if !combined_order
      redirect "/invoice?email=#{params[:email]}&ts=#{params[:ts].to_i}&hash=#{params[:hash]}"
    end
    @orders = stack_orders( Order.all(combined_order_id: combined_order.id) )
    if @orders.length == 0
      @error = "Order has probably aleardy been confirmed"
      @success = false
    else
      combined_order.update(confirmed: true, confirmed_at: Time.now, pickup_time: Time.now + 15*60)
      send_order_recap(user, @orders)
    end
  else
    @error = "Order has probably expired if it has been more than 24 hours since the order"
    @success = false
  end

  redirect "/invoice?email=#{params[:email]}&ts=#{params[:ts].to_i}&hash=#{params[:hash]}"
end


# ########### #
# ADMIN PANEL #
# ########### #

# LOAD ADMIN PAGE
get "/admin" do
  @logged_in = admin_logged_in?

  erb :admin_panel, :layout => false
end

# LOGIN TO ADMIN ACCOUNT
post "/admin-login" do
  admin = Admin.first(username: params[:username].downcase)
  if admin.password_hash = BCrypt::Engine.hash_secret(params[:password], admin.password_salt) && admin != nil
    session[:admin_id] = admin.id
  end

  redirect "/admin"
end

get "/orders" do
  if admin_logged_in?
    # Check if combined order is complete by iterating through all orders in combined_order
    CombinedOrder.all(confirmed: true, completed: false).each do |combined_order|
      completed = true
      Order.all(combined_order_id: combined_order.id).each do |order|
        if !order.done
          completed = false
          break
        end
      end
      if completed
        combined_order.update(completed: true, completed_at: Time.now)
      end
    end

    CombinedOrder.all(completed: true, delivered: false).each do |combined_order|
      all_done = true
      Order.all(combined_order_id: combined_order.id).each do |order|
        if !order.done
          all_done = false
          break
        end
      end
      if !all_done
        combined_order.update(completed: false)
      end
    end

    @todo_orders = CombinedOrder.all(confirmed: true, completed: false, :order => [ :pickup_time ])
    @ready_orders = CombinedOrder.all(completed: true, delivered: false, :order => [ :pickup_time ])
    @delivered_orders = CombinedOrder.all(delivered: true, :order => [ :delivered_at ], :limit => 10)

    erb :admin_show_orders, :layout => false
  else
    redirect '/admin'
  end
end

# MARK ORDER AS COMPLETE
get "/order-completed" do # params: order_id
  if admin_logged_in?
    Order.get( params[:order_id].to_i ).update(done: true)
    return "success".to_json
  else
    redirect '/admin'
  end
end

# MARK COMPLETE ORDER AS NOT COMPLETE
get "/order-uncompleted" do # params: order_id
  if admin_logged_in?
    Order.get( params[:order_id].to_i ).update(done: false)
    return "success".to_json
  else
    redirect '/admin'
  end
end

# UPDATE THE PICKUP TIME FOR AN ORDER
post "/order-ready-time" do
  if admin_logged_in? # FIXME: AJAX post request cannot get session to know if logged in
    if params[:ready_time].match(/\d\d:\d\d/) != nil
      order = Order.get(params[:order_id].to_i)
      ready_time = " #{params[:ready_time]}:00 "
      ready_time = Time.now.to_s.sub(/ (.*?) /, ready_time)
      ready_time = Time.parse(ready_time)
      order.update(ready_time: ready_time)
    end
  else
    redirect '/admin'
  end
end

# MARK ORDER AS PICKUPED/DEVILVERED & CHARGE USER
get "/delivered" do
  if admin_logged_in?
    order = CombinedOrder.get(params[:combined_order_id].to_i)
    order.update(delivered: true, delivered_at: Time.now)
    return "success".to_json
  end

  # Charge the Customer
  # begin
  #   Stripe::Charge.create(
  #     :amount => (params[:amount]*100).to_i, # in cents
  #     :currency => "eur",
  #     :customer => user.stripe_id,
  #     # :description => "Example charge", #TODO: Add detailed description of charge
  #     :metadata => object_to_hash(order)
  #   )
  # rescue Stripe::CardError => e
  #   # TODO: Error handling
  #   # The card has been declined
  #   return e
  # end
end

get "/undelivered"
  if admin_logged_in?
    order = CombinedOrder.get(params[:combined_order_id].to_i)
    order.update(delivered: false)
    return "success".to_json
  end
end

# SEARCH
post "/search" do
  # Search an order by first and last name, phone number, email
  queries = params[:query].gsub(/\s+/m, ' ').strip.split(" ")
  data = {}
  found_users = []

  queries.each do |query|
    # Find User
    if users = User.all(first_name: query.downcase)
      users.each do |user|
        found_users << user
      end
    elsif user = User.all(last_name: query.downcase)
      users.each do |user|
        found_users << user
      end
    elsif users = User.all(phone: query.to_i)
      users.each do |user|
        found_users << user
      end
    elsif users = User.all(email: query.downcase)
      users.each do |user|
        found_users << user
      end
    end

    found_users.each do |user|
      if data[user.id]
        data[user.id][:times] += 1
      else
        data[user.id] = {user: user, times: 1}
      end
    end

  end

  return data.to_json
end

# ############### #
# ACCOUNT CHANGES #
# ############### #

# LOAD ACCOUNT MODIFICATION PAGE
get "/update-account" do
  @user = User.first(email: params[:email])
  unless params[:hash] == user_hash(@user)
    return erb :root
  end

  erb :update_account, :layout => false
end

# UPDATE ACCOUNT
post "/update-account" do
  content_type :json

  user = User.first(email: params[:email])
  case params[:update]
    when "first_name"
      user.update(first_name: params[:data].downcase)
    when "last_name"
      user.update(last_name: params[:data].downcase)
    when "email"
      user.update(email: params[:data].downcase)
    when "phone"
      user.update(phone: params[:data].to_s.gsub(/\s+/, "").to_i)
  end
  session[:user_id] = user.id

  return {
    first_name: user.first_name.capitalize,
    last_name: user.last_name.capitalize,
    email: user.email,
    phone: "0#{user.phone.to_s}".gsub(/(.{2})(?=.)/, '\1 \2')
  }.to_json
end

# CREATE A NEW ADMIN ACCOUNT
post "/new-admin-account" do
  admin = Admin.first(username: params[:username])
  if BCrypt::Engine.hash_secret(params[:password], admin.salt) && Admin.first(username: params[:username]) == nil
    salt = BCrypt::Engine.generate_salt
    hash = BCrypt::Engine.hash_secret(params[:new_password], salt)
    Admin.create(username: params[:new_username].downcase, password_salt: salt, password_hash: hash)
  else
    # TODO: ERROR
  end
end

# UPDATE ADMIN PASSWORD
post "/update-admin-password" do
  admin = Admin.first(username: params[:username])
  if admin.password_hash == BCrypt::Engine.hash_secret(params[:password], admin.salt)
    hash = BCrypt::Engine.hash_secret(params[:new_password], admin.salt)
    admin.update(password: params[:new_password], hapassword_hashsh: hash)
  end
end
