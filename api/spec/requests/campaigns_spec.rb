require 'rails_helper'

RSpec.describe 'Campaigns API', type: :request do
    # Initial Test Data
    let!(:campaigns) { create_list(:campaign, 10) }
    let(:campaign_id) { campaigns.first.id }

    # Tests for GET /api/campaigns
    describe 'GET /api/campaigns' do  

        before { get '/api/campaigns' }

        it 'returns campaigns' do  
            expect(json).not_to be_empty 
            expect(json.size).to eq(10)
        end 

        it 'returns status code 200' do 
            expect(response).to have_http_status(200)
        end 
    end

    # Tests for GET /api/campaigns/:id 
    describe 'GET /api/campaigns/:id' do  
        before { get "/api/campaigns/#{campaign_id}" }

        context 'when campaign exists' do 
            it 'returns the campaign' do  
                expect(json).not_to be_empty 
                expect(json[:id]).to eq(campaign_id) 
            end

            it 'returns status code 200' do  
                expect(response).to have_http_status(200) 
            end
        end
    end

    # Tests for POST '/api/campaigns'
    describe 'POST /api/campaigns' do  

        let(:valid_attributes) { 
            {  
                campaign: {
                    title: Faker::Lorem.word, 
                    description: Faker::Lorem.paragraph,
                    goal: Faker::Number.between(1000, 1000000), 
                    pledged: Faker::Number.between(0, 10)
                }
            } 
        }

        context 'when the request is valid' do 
            
            before { post '/api/campaigns', params: valid_attributes }

            it 'creates a campaign' do  
                expect(json[:title]).to eq(valid_attributes[:campaign][:title]) 
                expect(json[:description]).to eq(valid_attributes[:campaign][:description])
                expect(json[:goal]).to eq(valid_attributes[:campaign][:goal])
                expect(json[:pledged]).to eq(valid_attributes[:campaign][:pledged])
                expect(json[:id]).not_to eq(nil)
            end

            it 'returns status code 201' do   
                expect(response).to have_http_status(201) 
            end
        end

        context 'when the request is invalid' do  
            before { post '/api/campaigns', params: { 
                campaign: {
                    title: '', description: '', goal: nil, pledged: nil
                } 
            } }

            it 'returns status code 422' do  
                expect(response).to have_http_status(422) 
            end

            it 'returns validation failure messages' do  
                expect(response.body).to match(/Validation failed: Title can't be blank, Description can't be blank, Goal can't be blank, Pledged can't be blank/)
            end
        end 
    end

    # Tests for PUT /api/campaigns/:id   
    describe 'PUT /api/campaigns/:id' do 

        let(:valid_attributes) { { campaign: { goal: Faker::Number.between(1000, 1000000) } } }
        
        context 'when the campaign exists' do  
            before { put "/api/campaigns/#{campaign_id}", params: valid_attributes }

            it 'updates the campaign' do 
                expect(json[:goal]).to eq(valid_attributes[:campaign][:goal])
            end

            it 'returns status code 200' do  
                expect(response).to have_http_status(200) 
            end  
        end

        context 'when the campaign is not found' do  
            let(:campaign_id) { 0 }
            before { put "/api/campaigns/#{campaign_id}", params: valid_attributes }

            it 'returns status code 404' do  
                expect(response).to have_http_status(404) 
            end

            it 'returns record not found message' do  
                expect(response.body).to match(/Couldn't find Campaign/)
            end
        end
    end

    # Test for DELETE /api/campaigns/:id  
    describe 'DELETE /api/campaigns/:id' do  
        before { delete "/api/campaigns/#{campaign_id}" }

        it 'returns status code 204' do 
            expect(response).to have_http_status(204)  
        end
    end
end
