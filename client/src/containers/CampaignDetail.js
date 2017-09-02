import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import CreateCommentForm from './CreateCommentForm';
import EditCampaignForm from './EditCampaignForm';
import Comment from '../components/Comment';
import { deleteCampaign } from '../actions/campaigns';
import { deleteComment } from '../actions/comments';
import { editButtonStyle, deleteButtonStyle } from '../styles';

class CampaignDetail extends Component {

    render() {
        const { campaign, deleteCampaign, deleteComment, match, history } = this.props;

        return (
            <div>
                <Route 
                    path={`${match.url}/edit`} 
                    component={EditCampaignForm} 
                />
                <Route 
                    exact 
                    path={match.url} 
                    render={() => (
                        campaign ?
                        <div>
                            <h2>{campaign.title}</h2>
                            <hr />
                            <h3>Goal: ${campaign.goal}</h3>
                            <h3>Pledged Support: ${campaign.pledged}</h3>
                            <p>{campaign.description}</p>
                            <Link to={{
                                pathname: `${match.url}/edit`,
                                state: { campaignId: campaign.id }
                            }}><button style={editButtonStyle}>Edit</button></Link>
                            <button style={deleteButtonStyle} onClick={() => deleteCampaign(campaign.id, history)}>Delete</button>
                            {campaign.comments.map(comment => <Comment key={comment.id} deleteComment={deleteComment} campaignId={campaign.id} comment={comment} />)}
                            {campaign.comments.length > 0 && <h4>Comments: </h4>}
                            <CreateCommentForm campaignId={campaign.id} />
                        </div>
                        :
                        <p>Loading...</p>
                    )}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        campaign: state.campaigns.find(campaign => campaign.id === +ownProps.match.params.campaignId)
    });
};

export default connect(mapStateToProps, { deleteCampaign, deleteComment })(CampaignDetail);