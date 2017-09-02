import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createCampaign } from '../actions/campaigns';
import CampaignForm from '../components/CampaignForm';

const CreateCampaignForm = ({ createCampaign, history }) => {
    return <CampaignForm header={'Create New Campaign'} buttonTitle={'Create'} onFormSubmit={createCampaign} history={history} />;
}

export default connect(null, { createCampaign })(CreateCampaignForm);