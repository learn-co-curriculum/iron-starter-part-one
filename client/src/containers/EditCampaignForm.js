import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateCampaign } from '../actions/campaigns';
import CampaignForm from '../components/CampaignForm';

const EditCampaignForm = ({ updateCampaign, campaign, history }) => {
    return <CampaignForm header={'Update Campaign'} buttonTitle={'Update'} onFormSubmit={updateCampaign} history={history} campaign={campaign} />;
}

const mapStateToProps = (state, ownProps) => {
    return ({
        campaign: state.campaigns.find(campaign => campaign.id === +ownProps.location.state.campaignId)
    });
};

export default connect(mapStateToProps, { updateCampaign })(EditCampaignForm);