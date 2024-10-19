class Message
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  
  belongs_to :event
  belongs_to :client
  
  field :from, type: String
  field :to, type: String
  field :message, type: String
end
