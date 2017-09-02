import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import CampaignDetail from './CampaignDetail';
import CreateCampaignForm from './CreateCampaignForm';
import { fetchCampaigns } from '../actions/campaigns';

class Campaigns extends Component  {

    componentDidMount() {
        this.props.fetchCampaigns();
    }
    
    render() {
        const { campaigns, match } = this.props;
        const renderCampaings = campaigns.map(campaign => (
            <Link 
                to={`${match.url}/${campaign.id}`} 
                key={campaign.id}
                style={{ textDecoration: 'none' }}
            >
                <CampaignCard campaign={campaign} />
            </Link>
        ));

        return (
            <div>
                {
                    <div>
                        <Switch>
                            <Route 
                                path={`${match.url}/new`} 
                                component={CreateCampaignForm} 
                            />
                            <Route 
                                path={`${match.url}/:campaignId`} 
                                component={CampaignDetail}
                            />
                            <Route 
                                exact 
                                path={match.url} 
                                render={() => (
                                    <div>
                                        <h2>Campaigns</h2>
                                        <hr />
                                        {renderCampaings}
                                    </div>
                                )}
                            />
                        </Switch>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return ({
        campaigns: state.campaigns
    });
}

export default connect(mapStateToProps, { fetchCampaigns })(Campaigns);