class CombinedOrder
  include DataMapper::Resource

  property :id, Serial
  property :submitted,    Boolean, :default => false
  property :submitted_at, DateTime
  property :confirmed,    Boolean, :default => false
  property :confirmed_at, DateTime
  property :completed,    Boolean, :default => false
  property :completed_at, DateTime
  property :delivered,    Boolean, :default => false
  property :delivered_at, DateTime
  property :pickup_time,  DateTime
  property :ready_time,   DateTime
  property :created_at,   DateTime
  property :updated_at,   DateTime

  belongs_to :user
  has n, :orders
end
