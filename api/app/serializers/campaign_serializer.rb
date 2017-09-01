class CampaignSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :goal, :pledged, :created_at, :updated_at

  has_many :comments
end
