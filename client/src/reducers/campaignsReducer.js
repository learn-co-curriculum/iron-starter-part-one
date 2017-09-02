import commentsReducer from './commentsReducer';

export default (state = [], action) => {
    switch(action.type) {

        case 'SET_CAMPAIGNS': {
            return action.campaigns;
        };

        case 'ADD_CAMPAIGN': {
            return state.concat(action.campaign);
        };

        case 'REPLACE_CAMPAIGN': {
            const index = state.findIndex(campaign => campaign.id === action.campaign.id);
            
            return [
                ...state.slice(0, index),
                action.campaign,
                ...state.slice(index + 1)
            ];
        };

        case 'REMOVE_CAMPAIGN': {
            const index = state.findIndex(campaign => campaign.id === action.campaignId);
            
            return [
                ...state.slice(0, index),
                ...state.slice(index + 1)
            ];
        };

        case 'SET_COMMENTS':
        case 'ADD_COMMENT':
        case 'REPLACE_COMMENT':
        case 'REMOVE_COMMENT': {
            const index = state.findIndex(campaign => campaign.id === action.campaignId);
            const campaign = state[index];
            const updatedCampaign = Object.assign({}, campaign, {
                comments: commentsReducer(campaign.comments, action)
            });

            return [
                ...state.slice(0, index),
                updatedCampaign,
                ...state.slice(index + 1)
            ];
        };
        
        default: {
            return state;
        };
    };
};