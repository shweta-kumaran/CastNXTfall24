class Announcement
    include Mongoid::Document
    include Mongoid::Timestamps::Created

    belongs_to :event

    field :from, type: String
    field :announcement, type: String
    field :for_client, type: Boolean
end
