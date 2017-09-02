# Iron Starter Part One

## Objectives

* Build React APP with CRUD for Campaigns using React, Redux & React Router Dom
* Integrate Redux Thunk into Redux Store to handle async API calls

## Introduction:

Congratulations on making it this far. We've learned a ton about Rails 5 API template and connecting it to a client app with React. In this lesson we are going to be building a full CRUD app to see how to connect all of the tools that we've learned thus far. 

To see the final app in action click [here](https://youtu.be/v5iyE9qFPmg) 

Note: You can eitther follow along with the walkthrough below or let the tests guide you to complete the application. 

## Instructions 

To get started we need to set up our API server and our client server. Let's do the API first. 

### API Server Setup

```bash 
cd api 
bundle install
rails db:migrate 
rails server -p 3001 
``` 

We can also run `rspec `just to double check that all of our API tests are passing. If everything is good to go let's setup the Client server. 

### Client Server Setup 

```
cd client 
npm install 
npm start
```

This should open the browser to localhost:3000 and show `Iron Starter` in the header div tag. 

### CRUD Life 

In this walkthrough we are going to be building a full CRUD app using React, Redux and React Router DOM that consumes Campaign objects from our Iron Start API. 

We will be using the basic skeleton React app we used in the previous lesson. So we should just have a `/client/src/index.js` file to mount our app & a `/client/src/App.js` file for our App component. 

We also have tests set up for Actions, Reducers and Components. These will not be working at the moment, but we will add some basic files and folders to get these working so you can follow along with the tests as we code this out. 

lets add the following folders and files to our `/client/src` to get started.

``` 
/client/src 
-----------
|- actions 
|       \_ apiRequestStatus.js
|       \_ campaigns.js
|- components
|       \_ CampaignCard.js
|       \_ CampaignForm.js
|       \_ Home.js
|- containers
|       \_ CampaignDetail.js
|       \_ Campaigns.js
|       \_ CreateCampaignForm.js 
|       \_ EditCampaignForm.js 
|- reducers 
|       \_ campaignsReducer.js
|       \_ apiRequestStatusReducer.js
|- store.js 
| ........
```

These files can just be blank for now, as we build this app out we will add the code we need.

### Setting up the Redux Store

It's always a good idea to imagine what the state of an application will look like before one starts to build the components. 

The state for this application is essentially an array of campaigns with their nested comments and an object that monitors that status of API Requests. Here is an example of what the redux store's state should look like. 

```javascript
{
    apiRequestStatus: {
        makingAPIRequest: false,
        failedLastAPIRequest: false,
    },
    campaigns: [
        {
            id: 1,
            title: 'First Title', 
            description: 'First Description',
            goal: 450000,
            pledged: 45,
            created_at: "2017-08-28T20:33:07.449Z",
            updated_at: "2017-08-28T20:33:07.449Z",
            comments: [
                { 
                    id: 1, 
                    content: 'First Comment', 
                    created_at: "2017-08-28T20:33:07.449Z", 
                    updated_at: "2017-08-28T20:33:07.449Z", 
                },
                { 
                    id: 2, 
                    content: 'Second Comment', 
                    created_at: "2017-08-28T20:33:07.449Z", 
                    updated_at: "2017-08-28T20:33:07.449Z" 
                }
            ]
        },
        {
            id: 2,
            title: 'Second Title',
            description: 'Second Description',
            goal: 20000,
            pledged: 10000,
            created_at: "2017-08-28T20:33:07.449Z",
            updated_at: "2017-08-28T20:33:07.449Z",
            comments: []
        }
    ];
}
```

Looking at the big picture of the app gives us an idea how to manage our reducers and set up store. Let's go ahead and set up our store. Our application already includes all of the node modules for React, Redux, React Redux and React Router DOM. Just make sure to run `npm install` to activate them all. 

Let's start with creating the store creating two basic reducers in our `./reducers/apiRequestStatusReducer.js` & `./reducers/campaignsReducer.js` files. Lets do the easy one first (APIRequestStatusReducer) and handle the three possible action types `['MAKING_API_REQUEST', 'SUCCESSFUL_API_REQUEST', 'UNSUCCESSFUL_API_REQUEST']`

```javascript
// ./reducers/apiRequestStatusReducer.js

const initialState = {
    makingAPIRequest: false,
    failedLastAPIRequest: false,
};

export default (state = initialState, action) => {
    switch(action.type) {

        case 'MAKING_API_REQUEST': {
            return {
                ...state,
                makingAPIRequest: true
            };
        };

        case 'SUCCESSFUL_API_REQUEST': {
            return {
                ...state,
                makingAPIRequest: false
            };
        };

        case 'UNSUCCESSFUL_API_REQUEST': {
            return {
                makingAPIRequest: false,
                failedLastAPIRequest: true,
            };
        };

        default: 
            return state;
    };
};
```

This will now set our initial state of the apiRequestStatusReducer to now equal `{ makingAPIRequest: false, failedLastAPIRequest: false, };`. We also added in action types that will handle the making and successful/unsuccessful return of request to our API. If we run `npm test` we should now have 4 tests passing for the `APIRequestStatus Reducer` block. 

Next we want to handle the reducer state for campaigns. For this we need to handle setting campaigns, adding campaigns, updating/replacing campaigns and removing campaigns. The 4 action types should look like `['SET_CAMPAIGNS', 'ADD_CAMPAIGN', 'REPLACE_CAMPAIGN', 'REMOVE_CAMPAIGN']`. 

Let's go ahead and build out the `./reducers/campaignsReducer.js' file:

```javascript
// ./reducers/campaignsReducer.js

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
        
        default: {
            return state;
        };
    };
};

```

As we've covered actions and reducers in the Redux section of the course. We will just briefly go over this code. Basically we have 4 cases one handling the unqiue action types and return a new copy of state with slight changes, such as removing or replacing a campaign. If we run the `npm test` command we should now have 9 tests passing. 

### Add Reducers to the Redux Store 

Now that we have our two reducers it is time to setup our store and connect it to our React app. This will require the __Redux__, __React Redux__ library which have already been included in our package.json, so we should have access to these already. 

Open the `./store.js` file and let's add the following code. 

```javascript 
// ./store.js
import { createStore, combineReducers } from 'redux' 
import campaigns from './reducers/campaignsReducer';
import apiRequestStatus from './reducers/apiRequestStatusReducer';

const reducers = combineReducers({
    apiRequestStatus,
    campaigns,
});

export default createStore(
    reducers, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // <- Used for debugging the code in your browser with Redux Devtools Chrome extendsion. 
);
```

On the first 3 lines we are importing the `createStore`, `combineReducers`, and our reducer  functions to setup our app state. We then defined a variable called `reducers` that merged in the state of the `apiRequestStatus` reducer and the `campaigns` reducer. We imported the names as `apiRequestStatus` and `campaigns`, because we want our state to look like

```javascript
{
    apiRequestStatus: {
        ...
    },
    campaigns: [
        {...}, {...}
    ]
}
```

instead of

```javascript 
{
    apiRequestStatusReducer: {
        ...
    },
    campaignsReducer: [
        {...}, {...}
    ]
}
``` 

The first one is more succinct than the other. 

Next we are using the `createStore()` function as our default export and passing in the reducers and Redux devtools initializer. This is also where we would apply middleware (think Redux Thunk), if and when we need it. Now all we have to do is import this file from anywhere in our app and it will instantiate the Redux store for us. 

### Connecting the Store to our App

Let's go to our `./src/index.js` file and add the store to the React app. We will need to use the __Provider__ component supplied by __React Redux__ and pass it the prop of `store` using and import of the `store.js` file we just created. 

```javascript 
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // <- Import the Provider component from React Redux
import App from './App';
import store from './store'; // <- Import the store from our store.js file
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
    <Provider store={store}> {/*  Wrap the App component inside of the Provider component with a prop of store */}
        <App />
    </Provider>, 
    document.getElementById('root')
);
registerServiceWorker();
```

Just to verify the store works. Lets add a `console.log(store.getState()` right before the `ReactDOM.render()` function in our `index.js` file. If we check out the dev console in Chrome, we should see this printed out:

```javascript 
{
    apiRequestStatus: {
        makingAPIRequest: false,
        failedLastAPIRequest: false,
    },
    campaigns: [],
}
```

We've successfully set up our store. Now it's time to use our store so we are able to Create, Read, Update and Delete campaigns. 

### Master Routes

Let's go to our `App.js` file and add a couple of routes to set us up with a Home component when we are at the root `/` route and a Campaigns component when we are at `/campaigns`. Open up the `App.js` and add the following code.

```javascript
// ./src/App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'; 
import Home from './components/Home'; 
import Campaigns from './containers/Campaigns';
import { appStyle, brandButtonStyle, headerStyle, navButtonStyle } from './styles';

class App extends Component {
    render() {
        return (
            <Router>
                <div style={appStyle}>
                    <div style={headerStyle}>
                        <Link to="/"><button style={brandButtonStyle}>Iron Starter</button></Link>
                        <Link to="/campaigns"><button style={navButtonStyle}>Campaigns</button></Link>
                        <Link to="/campaigns/new"><button style={navButtonStyle}>Create Campaign</button></Link>
                    </div>
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/campaigns" component={Campaigns} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
```

Let's take a miniute to talk about this code. First we are import __Router, Route & Link__ from __React Router DOM__ to create a routing system with links, and trigger the loading of components when the url is at `/` & `/campaigns`. There is also an import of styles from the `styles.js` file, these are imported to add styling to the elements. Feel free to take a look at that file, if you are interested. This new code does break our app, because we are importing to __Components__ that do not exist. Let's add those now.

```javascript 
// ./components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ marginTop: '32px', padding: '16px' }}>
            <h1>Welcome To Iron Starter</h1>
            <p>Find exciting campaigns to fund, start a campaign for something you are passionate about, or just browse around and see what new intersting ideas people have.</p>
            <p>Click <Link to='/campaigns'>here</Link> to see the available campaigns to support</p>
        </div>
    )
}

export default Home;

// ./containers/Campaigns.js
import React, { Component } from 'react';

class Campaigns extends Component  {

    render() {
        return (
            <div>
                <h2>Campaigns</h2>
            </div>
        );
    };
}

export default Campaigns;
```

Try out the browser and see if the transitions from `/ - /campaigns` renders the new components correctly. So we are finished with the __Home__ Component, but the campaigns component seems like a good place to make API request to our backend to get Campaigns and then have it subscribe to the store for changes to `state.camapaigns`, but first we need to add a few Action Creators and an Async action request. 

### Action Creators and Async Action Requests

We are going to go ahead and build out all of the async actions and action creators we need, before finishing up the components. Again there are tests for all of these actions in the `./client/test/actions` directory. Feel free to follow along, or take a chance at solving these with the tests as a guide. 

First let's add actions for the APIRequestStatus. We need it to handle making an API request, a successful API request and an unsuccessful API request. 

```javascript 
// ./src/actions/apiRequestStatus.js

// @ Action Creators 
export const makingAPIRequest = () => {
    return { type: 'MAKING_API_REQUEST' };
};

export const successfulAPIRequest = () => {
    return { type: 'SUCCESSFUL_API_REQUEST' };
};

export const unsuccessfulAPIRequest = () => {
    return { type: 'UNSUCCESSFUL_API_REQUEST' };
};
```

All of the tests for __APIRequestStatus Action Creators__ shoud be passing now!

Next we need to add the code to handle setting campaigns, adding a campaign, replacing a campaign and removing a campaign.

```javascript 
// ./src/actions/campaigns.js

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
```

Now all of the tests for the campaigns __Action Creators__ should be passing, but we still need to create our __Async Actions__ for the campaigns. We will need to add some imports at the top of the file and create a constant variable to hold our API url.

```javascript 
// ./src/actions/campaigns.js

import { 
    makingAPIRequest, 
    successfulAPIRequest, 
    unsuccessfulAPIRequest 
} from './apiRequestStatus';

const API_URL = 'http://localhost:3001/api';

// ....
```

Now that we've imported the actions from our APIReqeustStatus actions file. We need to focus on building out our Async actions, but we have one problem. Redux works synchronously and Async actions, well that don't, hence the name. So we need to add in a middleware library that allows our Redux store to handle async actions. We've used [Redux Thunk](https://github.com/gaearon/redux-thunk) in previous labs, and that is a great tool for the job (it is already added to our package.json). Before we can use this though, we need to apply it to our store using the `applyMiddleware()` function. Let's go to `store.js` and add the needed code. 

```javascript 
// ./src/store.js
import { applyMiddleware, createStore, combineReducers } from 'redux' // <- Add applyMiddleware
import thunk from 'redux-thunk'; // <- Import thunk
import campaigns from './reducers/campaignsReducer';
import apiRequestStatus from './reducers/apiRequestStatusReducer';

const reducers = combineReducers({
    apiRequestStatus,
    campaigns,
});
const middleware = [thunk];

export default createStore(
    reducers, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(...middleware)
);
```

Now we should be able to handle async actions. Let's go back to `./actions/campaigns` and add the following code. 

```javascript
// ./src/actions/campaigns 

// ... previous code 

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
                routerHistory.replace(`/campaigns/${campaign.id}`);
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
```

Take a few minutes to look at this code. Most of it should be familiar, but notice that a few of the methods are being passed a `routerHistory` object that is then used to redirect upon completion. Also take a look at the test file `./test/actions/CampaignsActionsTests.js` to see how we used a mock API service to handle the fetch requests. This was set up to equal the same spec we used for our Rails API tests, so we knew what responses we would recieve. Now all of our Action tests should be passing. 

Let's connect our Campaigns Component up to the store now and create a few new components. 

```javascript 
// ./src/containers/Campaigns.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch } from 'react-router-dom';
// NOTE: we need to create the next 3 components
import CampaignCard from '../components/CampaignCard'; 
import CampaignDetail from './CampaignDetail';
import CreateCampaignForm from './CreateCampaignForm';
import { fetchCampaigns } from '../actions/campaigns'; // <- Imported Async Action

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
``` 

In the above code we are mapping `state.campaigns` as `campaigns` prop to the campaigns component as well as passing the dispatch function `fetchCampaigns` that we are using in `componentDidMount` to get our campaigns. This code will not run at the moment, becuase we need to add the following components: CampaignCard, CampaignDetail and CreateCampaignForm. Let's add these components now.

#### CampaignCard

The CampaignCard component will be a very basic stateless component that just renders the individual info about a campaign to be displayed in a list. 

```javascript 
// ./src/components/CampaignCard.js
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
```

If we go to `/campaigns` now in the browser it should display the new CampaignCard, but if we click on the card it will break because we need the CampaignDetail component to view an individual Campaign.

### CampaignDetail

The `CampaignDetail` component needs to connect to the __Redux__ store to get information about a single Campaign. It will use the prop of `match.url.params.campaignId` passed down from __React Router DOM__ to find a campaign with a matching id in the stores list of campaigns. We will also need to add an `EditCampaignForm` component and import our `deleteCampaign` action. Let's add the following code to `CampaignDetail.js` :

```javascript 
// ./src/containers/CampaignDetail.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import EditCampaignForm from './EditCampaignForm';
import { deleteCampaign } from '../actions/campaigns';
import { editButtonStyle, deleteButtonStyle } from '../styles';

class CampaignDetail extends Component {

    render() {
        const { campaign, deleteCampaign, match, history } = this.props;

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

export default connect(mapStateToProps, { deleteCampaign })(CampaignDetail);
```

Adding the following code should allow the `CampaignDetail` component to load in the browser, but clicking on edit will fail. Let's add the `CreateCampaignForm` and `EditCampaignForm` next'. 

### Campaign Forms

So we are going to create a `CampaignForm` component first that both the `CreateCampaignForm` and `EditCampaignForm` components can pass props down to it. 
The campaign form will take 4 required props (header, buttonTitle, onFormSubmit - callback function and history) and one optional (campaign). Here is what the code for `CampaignForm` should look like:

```javascript
// ./src/components/CampaignForm.js 

import React, { Component } from 'react';
import { inputStyle, textAreaStyle, submitButtonStyle } from '../styles';

class CampaignForm extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            goal: 0,
            pledged: 0,
        }
    }

    componentDidMount() {
        this.setState({
            ...this.props.campaign
        })
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
        this.props.onFormSubmit(campaign, this.props.history);
    }

    render() {
        return (
            <form onSubmit={this.handleOnSubmit}>
                <h2>{this.props.header}</h2>
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
                        {this.props.buttonTitle}
                    </button>
                </div>
            </form>
        );
    }
};

export default CampaignForm;
```

This component is updating the state of an item upon input change and on submit is invoking the callback on `this.props.onFormSubmit` that we will be passing down from our connected `EditCampaignForm` and `CreateCampaignForm` components. Here is what those two components should look like:

```javascript

// ./src/containers/CreateCampaignForm.js 

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createCampaign } from '../actions/campaigns';
import CampaignForm from '../components/CampaignForm';

const CreateCampaignForm = ({ createCampaign, history }) => {
    return <CampaignForm header={'Create New Campaign'} buttonTitle={'Create'} onFormSubmit={createCampaign} history={history} />;
}

export default connect(null, { createCampaign })(CreateCampaignForm);



// ./src/containers/EditCampaignForm.js

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
```

Now that these components are up, we should be able to view campaigns, create a new campaign, view an individual campaign, edit an existing campaign and delete a campaign. Are app is almost complete but does not show or allow the creation or deletion of comments. This will be done in the following lab, so be ready for a new challenge. Great job on following along and building a full stack CRUD app v1 is complete.

### Summary

In this lesson we learned how to use React, Redux, React Router Dom and Redux Thunk to build a fully featured React app that connect to a custom built Rails API. This has been intense adventure, and we've learned a ton. In the next lab we are going to be building out the comments section of the app, so take a breather and get ready to finish our Iron Starter MVP. 

<p class='util--hide'>View <a href='https://learn.co/lessons/iron-starter-part-one'>Iron Starter Part One</a> on Learn.co and start learning to code for free.</p>