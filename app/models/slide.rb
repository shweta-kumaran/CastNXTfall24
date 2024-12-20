class Slide
  include Mongoid::Document
  include Mongoid::Timestamps
  
  belongs_to :event
  belongs_to :talent
  has_and_belongs_to_many :clients
  has_many :comments
  has_many :messages
  
  field :curated, type: Boolean
  field :data, type: String
  field :submission_status, type: String
  field :been_paid, type:Boolean
end