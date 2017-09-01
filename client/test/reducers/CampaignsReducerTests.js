import { expect } from 'chai';
import uuid from 'uuid';
import reducer from '../../src/reducers/campaignsReducer';

describe('Campaigns Reducer', () => {
    let firstCampaignId;
    let secondCampaignId;
    let campaigns;
    let campaign;

    beforeEach(() => {
        firstCampaignId = uuid();
        secondCampaignId = uuid();
        campaigns = [
            {
                id: firstCampaignId,
                title: 'First Title', 
                description: 'First Description',
                goal: 450000,
                pledged: 45,
                created_at: new Date(),
                updated_at: new Date(),
                comments: [
                    { id: uuid(), content: 'First Comment', created_at: "2017-08-28T20:33:07.449Z", updated_at: "2017-08-28T20:33:07.449Z" },
                    { id: uuid(), content: 'Second Comment', created_at: "2017-08-28T20:33:07.449Z", updated_at: "2017-08-28T20:33:07.449Z" }
                ]
            },
            {
                id: secondCampaignId,
                title: 'Second Title',
                description: 'Second Description',
                goal: 20000,
                pledged: 10000,
                created_at: new Date(),
                updated_at: new Date(),
                comments: []
            }
        ];
        campaign = campaigns[1];
    });

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).to.deep.equal([]);
    });

    it('should handle SET_CAMPAIGNS', () => {
        expect(reducer(undefined, {
            type: 'SET_CAMPAIGNS',
            campaigns
        })).to.deep.equal(campaigns);
    });

    it('should handle ADD_CAMPAIGN', () => {
        const newCampaign = {
            id: uuid(),
            title: 'Test Title',
            description: 'Test Description',
            goal: 5000,
            pledged: 0,
            created_at: new Date(),
            updated_at: new Date(),
            comments: []
        };

        expect(reducer(campaigns, {
            type: 'ADD_CAMPAIGN',
            campaign: newCampaign
        })).to.deep.equal(campaigns.concat(newCampaign));
    });

    it('should handle REPLACE_CAMPAIGN', () => {
        const updatedCampaign = Object.assign({}, campaign, { title: 'Updated Title' });
        const index = campaigns.findIndex(campaign => campaign.id === updatedCampaign.id);
        
        expect(reducer(campaigns, {
            type: 'REPLACE_CAMPAIGN',
            campaign: updatedCampaign
        })).to.deep.equal([
            ...campaigns.slice(0, index),
            updatedCampaign,
            ...campaigns.slice(index + 1)
        ]);
    });

    it('should handle REMOVE_CAMPAIGN', () => {
        const index = campaigns.findIndex(campaignItem => campaignItem.id === campaign.id);
        
        expect(reducer(campaigns, {
            type: 'REMOVE_CAMPAIGN',
            campaignId: campaign.id
        })).to.deep.equal([
            ...campaigns.slice(0, index),
            ...campaigns.slice(index + 1)
        ]);
    });
});