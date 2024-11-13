class Message
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  
  belongs_to :event
  
  field :from, type: String
  field :to, type: Array
  field :message, type: String
  field :user_id, type: Array
end
