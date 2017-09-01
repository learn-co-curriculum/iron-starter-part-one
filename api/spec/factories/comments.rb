FactoryGirl.define do  
    factory :comment do  
        content { Faker::Lorem.paragraph } 
        campaign_id nil 
    end 
end