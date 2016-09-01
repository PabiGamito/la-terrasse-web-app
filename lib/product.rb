class Product
  include DataMapper::Resource

  property :id,          Serial
  property :name,        String,  required: true
  property :price,       Float,   required: true
  property :in_stock,    Boolean, default: true
  property :ingredients, Text

  has n, :orders
end
