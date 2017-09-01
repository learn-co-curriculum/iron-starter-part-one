import { expect } from 'chai';
import uuid from 'uuid';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import 'isomorphic-fetch';
import { setCampaigns, addCampaign, removeCampaign, replaceCampaign, fetchCampaigns, fetchCampaign, createCampaign, updateCampaign, deleteCampaign } from '../../src/actions/campaigns';

describe('Campaigns Action', () => {

    let campaign;
    let campaigns;

    beforeEach(() => {
        campaigns = [
            {
                id: uuid(),
                title: 'First Title', 
                description: 'First Description',
                goal: 450000,
                pledged: 45,
                deadline: "2017-08-29T17:47:59.517Z",
                created_at: "2017-08-29T17:47:59.517Z",
                updated_at: "2017-08-29T17:47:59.517Z",
                comments: []
            },
            {
                id: uuid(),
                title: 'Second Title',
                description: 'Second Description',
                goal: 20000,
                pledged: 10000,
                deadline: "2017-08-29T17:47:59.517Z",
                created_at: "2017-08-29T17:47:59.517Z",
                updated_at: "2017-08-29T17:47:59.517Z",
                comments: []
            }
        ];
        campaign = campaigns[0];
    });

    describe('Action Creators', () => {

        describe('setCampaigns(campaigns: Array<Campaign>', () => {
            it('should return an Object with a SET_CAMPAIGNS type and Campaigns: Array<Campaign>', () => {
                expect(setCampaigns(campaigns)).to.deep.equal({
                    type: 'SET_CAMPAIGNS',
                    campaigns
                });
            });
        });

        describe('addCampaign(Campaign: Object)', () => {
            it("should return an Object with a 'ADD_CAMPAIGN' type and a Campaign: Object", () => {
                expect(addCampaign(campaign)).to.deep.equal({
                    type: 'ADD_CAMPAIGN', 
                    campaign,
                });
            });
        });

        describe('replaceCampaign(Campaign: Object)', () => {
            it("should return an Object with a 'REPLACE_CAMPAIGN' type and a Campaign: Object", () => {
                expect(replaceCampaign(campaign)).to.deep.equal({
                    type: 'REPLACE_CAMPAIGN',
                    campaign,
                });
            });
        });

        describe('removeCampaign(campaignId: Number)', () => {
            it("should return an Object with a 'REMOVE_CAMPAIGN' type", () => {
                expect(removeCampaign(campaign.id)).to.deep.equal({
                    type: 'REMOVE_CAMPAIGN', 
                    campaignId: campaign.id
                });
            });
        });
    });

    describe('Async Actions', () => {
        const url = 'http://localhost:3001/api';
        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);
        const requiredActionCreators = [
            { type: 'MAKING_API_REQUEST' },
            { type: 'SUCCESSFUL_API_REQUEST' }
        ];
        const routerHistory = {
            replace(string) { return string }
        }
        let store;
        let initialState;
        
        beforeEach(() => {
            initialState = {
                campaigns
            };
            store = mockStore(initialState)
        });
    
        afterEach(() => nock.cleanAll());
    
        describe('fetchCampaigns()', () => {
            it('dispatches MAKING_API_REQUEST, SUCCESSFUL_API_REQUEST and SET_CAMPAIGNS action types', () => {
                nock(url)
                    .get(`/campaigns`)
                    .reply(200, campaigns);
    
                return store.dispatch(fetchCampaigns())
                    .then(() => expect(store.getActions()).to.deep.equal([
                        ...requiredActionCreators,
                        { type: 'SET_CAMPAIGNS', campaigns }
                    ]));
            });
        });

        describe('fetchCampaign()', () => {
            it('dispatches MAKING_API_REQUEST, SUCCESSFUL_API_REQUEST and SET_CAMPAIGNS action types', () => {
                nock(url)
                    .get(`/campaigns/${campaign.id}`)
                    .reply(200, campaign);
    
                return store.dispatch(fetchCampaign(campaign.id))
                    .then(() => expect(store.getActions()).to.deep.equal([
                        ...requiredActionCreators,
                        { type: 'SET_CAMPAIGNS', campaigns: [campaign] }
                    ]));
            });
        });
    
        describe('createCampaign(campaign: Object)', () => {
            it('dispatches MAKING_API_REQUEST, SUCCESSFUL_API_REQUEST and ADD_CAMPAIGN action types', () => {
                const newCampaign = Object.assign({}, campaign, { id: uuid(), title: 'hi' })
    
                nock(url)
                    .post(`/campaigns`)
                    .reply(201, newCampaign);
    
                return store.dispatch(createCampaign(newCampaign, routerHistory))
                    .then(() => expect(store.getActions()).to.deep.equal([
                        ...requiredActionCreators,
                        { type: 'ADD_CAMPAIGN', campaign: newCampaign }
                    ]));
            });
        });
    
        describe('updateCampaign(campagin: Object', () => {
            it('dispatches MAKING_API_REQUEST, SUCCESSFUL_API_REQUEST and REPLACE_CAMPAIGN action types', () => {
                const updatedCampaign = Object.assign({}, campaign, { title: 'Updated Title' });
                
                nock(url)
                    .put(`/campaigns/${campaign.id}`)
                    .reply(200, updatedCampaign);
    
                return store.dispatch(updateCampaign(updatedCampaign, routerHistory))
                    .then(() => expect(store.getActions()).to.deep.equal([
                        ...requiredActionCreators,
                        { type: 'REPLACE_CAMPAIGN', campaign: updatedCampaign }
                    ]));
            });
        });
    
        describe('deleteCampaign(campaignId: Number)', () => {
            it('dispatches MAKING_API_REQUEST, SUCCESSFUL_API_REQUEST and REMOVE_CAMPAIGN action types', () => {
                nock(url)
                    .delete(`/campaigns/${campaign.id}`)
                    .reply(204);
    
                return store.dispatch(deleteCampaign(campaign.id, routerHistory))
                    .then(() => expect(store.getActions()).to.deep.equal([
                        ...requiredActionCreators,
                        { type: 'REMOVE_CAMPAIGN', campaignId: campaign.id }
                    ]));
            });
        });
    });
});

