require 'rails_helper'

RSpec.describe Campaign, type: :model do
  
  it { should have_many(:comments).dependent(:destroy) }
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:description) }
  it { should validate_presence_of(:goal) }
  it { should validate_presence_of(:pledged) }
end
