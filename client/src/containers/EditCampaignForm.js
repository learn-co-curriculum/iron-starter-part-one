import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateCampaign } from '../actions/campaigns';
import { inputStyle, textAreaStyle, submitButtonStyle } from '../styles';

class EditCampaignForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '', 
            goal: 0,
            pledged: 0
        }
    }

    componentDidMount() {
        this.setState({
            ...this.props.campaign
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.campaign) {
            this.setState({
                ...nextProps.campaign
            })
        }
    }

    handleOnChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleOnSubmit = event => {
        event.preventDefault()
        const campaign = this.state;
        this.props.updateCampaign(campaign, this.props.history);
    }

    render() {
        return (
            <form onSubmit={this.handleOnSubmit}>
                <h2>Update Campaign</h2>
                <hr />
                <div style={{ marginTop: '16px' }}>
                    <div>
                        <label htmlFor="title">Title:</label>
                    </div>
                    <input
                        style={inputStyle} 
                        type="text" 
                        name="title" 
                        value={this.state.title} 
                        onChange={this.handleOnChange} 
                    />
                </div>
                <div>
                    <div>
                        <label htmlFor="description">Description:</label>
                    </div>
                    <textarea 
                        style={textAreaStyle}
                        name="description" 
                        value={this.state.description}
                        onChange={this.handleOnChange}
                    >
                    </textarea>
                </div>
                <div>
                    <div>
                        <label htmlFor="goal">Goal:</label>
                    </div>
                    <input
                        style={inputStyle} 
                        type="number" 
                        name="goal" 
                        value={this.state.goal === 0 ? '' : this.state.goal}
                        onChange={this.handleOnChange} 
                    />
                </div>
                <div>
                    <div>
                        <label htmlFor="pledged">Pledged:</label>
                    </div>
                    <input
                        style={inputStyle} 
                        type="number" 
                        name="pledged" 
                        value={this.state.pledged === 0 ? '' : this.state.pledged}
                        onChange={this.handleOnChange} 
                    />
                </div>
                <div>
                    <button 
                        style={submitButtonStyle} 
                        type="submit"
                    >
                        Update
                    </button>
                </div>
            </form>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return ({
        campaign: state.campaigns.find(campaign => campaign.id === +ownProps.location.state.campaignId)
    });
};

export default connect(mapStateToProps, { updateCampaign })(EditCampaignForm);