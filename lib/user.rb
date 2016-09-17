class User
  include DataMapper::Resource

  property :id,         Serial
  property :ip,         String
  property :first_name, String
  property :last_name,  String
  property :email,      String,  format: :email_address, unique_index: true
  property :phone,      Integer
  property :stripe_id,  Integer
  property :salt,       String

  has n, :orders
  has n, :combined_orders
  has n, :reservations
end
