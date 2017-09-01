class Campaign < ApplicationRecord
    has_many :comments, dependent: :destroy

    validates :title, :description, :goal, :pledged, presence: true
end
