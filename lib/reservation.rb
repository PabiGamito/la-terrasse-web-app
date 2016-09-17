class Reservation
  include DataMapper::Resource

  property :id,     Serial
  property :name,   String,   required: true
  property :people, Integer,  required: true
  property :date,   DateTime, required: true

  belongs_to :user
end
