import { 
    makingAPIRequest, 
    successfulAPIRequest, 
    unsuccessfulAPIRequest 
} from './apiRequestStatus';

const API_URL = 'http://localhost:3001/api';

// @ Action Creators 
export const setCampaigns = campaigns => {
    return {
        type: 'SET_CAMPAIGNS',
        campaigns
    };
};

export const addCampaign = campaign => {
    return {
        type: 'ADD_CAMPAIGN',
        campaign
    };
};

export const replaceCampaign = campaign => {
    return {
        type: 'REPLACE_CAMPAIGN',
        campaign
    };
};

export const removeCampaign = campaignId => {
    return {
        type: 'REMOVE_CAMPAIGN',
        campaignId
    };
};

// @ Async Actions
export const fetchCampaigns = () => {
    return dispatch => {
        dispatch(makingAPIRequest());
        return fetch(`${API_URL}/campaigns`)
            .then(response => response.json())
            .then(campaigns => {
                dispatch(successfulAPIRequest());
                dispatch(setCampaigns(campaigns));
            })
            .catch(err => dispatch(unsuccessfulAPIRequest()));
    };
};

export const fetchCampaign = (campaignId) => {
    return dispatch => {
        dispatch(makingAPIRequest());
        return fetch(`${API_URL}/campaigns/${campaignId}`)
            .then(response => response.json())
            .then(campaign => {
                dispatch(successfulAPIRequest());
                dispatch(setCampaigns([campaign]));
            })
            .catch(err => dispatch(unsuccessfulAPIRequest()));
    };
};


export const createCampaign = (campaign, routerHistory) => {
    return dispatch => {
        dispatch(makingAPIRequest());
        return fetch(`${API_URL}/campaigns`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                campaign
            })
        })
            .then(response => response.json())
            .then(campaign => {
                dispatch(successfulAPIRequest());
                dispatch(addCampaign(campaign));
                routerHistory.replace('/');
            })
            .catch(err => dispatch(unsuccessfulAPIRequest()));
    };
};

export const updateCampaign = (campaign, routerHistory) => {
    return dispatch => {
        dispatch(makingAPIRequest());
        return fetch(`${API_URL}/campaigns/${campaign.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                campaign
            })
        })
        .then(response => response.json())
        .then(campaign => {
            dispatch(successfulAPIRequest());
            dispatch(replaceCampaign(campaign));
            routerHistory.replace(`/campaigns/${campaign.id}`);
        })
        .catch(err => dispatch(unsuccessfulAPIRequest()));
    };
};

export const deleteCampaign = (campaignId, routerHistory) => {
    return dispatch => {
        dispatch(makingAPIRequest());
        return fetch(`${API_URL}/campaigns/${campaignId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                dispatch(successfulAPIRequest());
                dispatch(removeCampaign(campaignId));
                routerHistory.replace(`/campaigns`);
            } else {
                dispatch(unsuccessfulAPIRequest());
            }
        })
        .catch(err => unsuccessfulAPIRequest());
    };
};

