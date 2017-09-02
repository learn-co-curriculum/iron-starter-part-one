import React from 'react';
import { campaignCardStyle } from '../styles';

const CampaignCard = ({ campaign, }) => {
    return (
        <div style={campaignCardStyle}>
            <h2>{campaign.title}</h2>
            <h4>Goal: {campaign.goal}</h4>
            <h4>Pledged: {campaign.pledged}</h4>
            <p>{campaign.description}</p>
        </div>
    );
};

export default CampaignCard;