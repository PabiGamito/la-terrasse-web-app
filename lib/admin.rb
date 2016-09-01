class Admin
  include DataMapper::Resource

  property :id,            Serial
  property :username,      String, unique_index: true
  property :password_salt, String
  property :password_hash, Text

end
