class Order
  include DataMapper::Resource

  property :id,           Serial
  property :amount,       Integer, :default => 1
  property :submitted,    Boolean, :default => false
  property :created_at,   DateTime
  property :updated_at,   DateTime

  belongs_to :product
  belongs_to :user
  belongs_to :combined_order
end
