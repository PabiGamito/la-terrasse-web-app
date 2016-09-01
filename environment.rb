require 'rubygems'
require 'bundler/setup'
require 'dotenv'
require 'dm-core'
require 'dm-timestamps'
require 'dm-validations'
require 'dm-aggregates'
require 'dm-migrations'
require 'ostruct'
require 'bcrypt'
require 'pony'
require 'pry'
require 'stripe'

require 'sinatra' unless defined?(Sinatra)

Dotenv.load

configure do
  # load models
  $LOAD_PATH.unshift("#{File.dirname(__FILE__)}/lib")
  Dir.glob("#{File.dirname(__FILE__)}/lib/*.rb") { |lib| require File.basename(lib, '.*') }

  # Setup database
  DataMapper.setup(:default, (ENV["DATABASE_URL"] || "sqlite3:///#{File.expand_path(File.dirname(__FILE__))}/#{Sinatra::Base.environment}.db"))
  DataMapper.finalize
  DataMapper.auto_upgrade!

  load 'InitializepizzaDB.rb'
  if Admin.all.length == 0 # if no Admin account exists create default one
    salt = BCrypt::Engine.generate_salt
    hash = BCrypt::Engine.hash_secret("password", salt)
    Admin.create(username: "admin", password_salt: salt, password_hash: hash)
  end

  # Setup mailing service
  Pony.options = {
    :via => :smtp,
    :via_options => {
      :address              => 'smtp.la-terrasse-pizzeria.fr',
      :port                 => '465',
      :enable_starttls_auto => true,
      :user_name            => 'ne-pas-repondre@la-terrasse-pizzeria.fr',
      :password             => 'nagX6!05',
      :authentication       => :plain, # :plain, :login, :cram_md5, no auth by default
      :domain               => "localhost.localdomain"
    }
  }

  # Setup stripe payment system
  Stripe.api_key = "sk_test_b9jKn5v06yPFPuAN8LmyKmfT"

  pry

end
