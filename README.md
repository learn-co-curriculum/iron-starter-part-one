# Iron Starter Part One

## Objectives

* Build React CRUD App using React, Redux & React Router Dom
* Integrate Redux Thunk into Redux Store to handle async API calls

## Introduction:

Congratulations on making it this far. We've learned a ton about Rails 5 API template and connecting it to a client app with React. In this lesson we are going to be building a full CRUD app to see how to connect all of the tools that we've learned thus far. 

This is the app we will be building in the next couple lessons. [Iron Starter App Video](https://youtu.be/v5iyE9qFPmg)

Note: You can eitther follow along with the walkthrough below or let the tests guide you to complete the application. 

## Instructions 

We need to set up the servers for the API and React app to get started.

### API Server Setup

```bash 
cd api 
bundle install
rails db:migrate 
rails server -p 3001 
``` 

We can also run `rspec `just to double check that all of the API tests are passing. If everything is good to go let's setup the Client server. 

### Client Server Setup 

```
cd client 
npm install 
npm start
```

This should open the browser to localhost:3000 and show `Iron Starter` in the header div tag. There is a test watcher if we use the `npm test` command.

### CRUD Life 

In this walkthrough we are going to be building a full CRUD app using React, Redux and React Router DOM that consumes Campaign objects from our Iron Start API. 

We are using a basic skeleton React app from the previous lesson. It contains a `index.js` file to mount the app & a `App.js` file for the App component. 

We also have tests set up for the required Actions, Reducers and Components. These tests are not working at the moment, because we need to add the following files and folders:
``` 
/src 
----
|- actions 
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
|- store.js 
| ........
```

These files can just be blank for now, as we build this app out we will add the necessary code.

### Setting up the Redux Store

It's always a good idea to imagine what the state of an application will look like before building the actions and reducers.

The state for this application is essentially an array of campaigns with their nested comments. Here is an example of what the __Redux__ store's state should look like. 

```javascript
{
    campaigns: [
        {
            id: 1,
            title: 'First Title', 
            description: 'Second Description',
            goal: 20000,
            pledged: 10000,
            created_at: "2017-08-28T20:33:07.449Z",
            updated_at: "2017-08-28T20:33:07.449Z",
            comments: [
                {...}, {...}
            ]
        },
        { ... }
    ];
}
```

Looking at the required state of an app gives us a better idea of how to setup our reducers. Let's go ahead and set up our store. We've already included the React, Redux, React Redux and React Router DOM libraries in oure `package.json`. Just make sure to run `npm install` to activate them.

#### CampaignsReducer

Next we need to setup the CampaignsReducer. This reducers requires case statements for the handling the following action types: `['SET_CAMPAIGNS', 'ADD_CAMPAIGN', 'REPLACE_CAMPAIGN', 'REMOVE_CAMPAIGN']`. 

```javascript
// ./reducers/campaignsReducer.js

import commentsReducer from './commentsReducer';

export default (state = [], action) => {
    switch(action.type) {

        case 'SET_CAMPAIGNS':
            return action.campaigns;

        case 'ADD_CAMPAIGN':
            return state.concat(action.campaign);

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
        
        default:
            return state;
    };
};

```

### Add Campaign Reducer to the Redux Store 

Now that we have our Campaigns reducer defined we should setup our store and connect it to our React app.

Open the `store.js` file and add the following code:

```javascript 
// ./store.js
import { createStore, combineReducers } from 'redux' 
import campaigns from './reducers/campaignsReducer';

const reducers = combineReducers({
    campaigns,
});

export default createStore(
    reducers, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // <- Used for debugging the code in your browser with Redux Devtools Chrome extendsion. 
);
```

Let's take a moment to review this code. On the first 3 lines we are importing the `createStore`, `combineReducers`, and reducer functions. We then defined a variable called `reducers` that takes our `campaigns` reducer as an argument of `combineReducers`. Make note that we imported the `campaigns` reducer as `campaigns`, because we want our state to look like

```javascript
{
    campaigns: [
        {...}, {...}
    ]
}
```

instead of

```javascript 
{
    campaignsReducer: [
        {...}, {...}
    ]
}
``` 

The first one is more succinct than the other, and much easier to read. 

Next we use the `createStore` function and pass in the reducers and Redux devtools initializer. This is also where we would apply middleware (think Redux Thunk), if and when we need it. The `createStore` will be the default export value of this file, so we just need to import this file when we need to instantiate the store. 

### Connecting the Store to our App

To connect our React app to the store. We will need to use the __Provider__ component supplied by __React Redux__ and pass it the prop of `store` using an imported store from the `store.js` file we just created. 

```jsx 
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

To verify the store works. Let's add a `console.log(store.getState()` right before the `ReactDOM.render()` function. If we check out the dev console in Chrome, we should see this printed out:

```javascript 
{
    campaigns: [],
}
```

Yay!! We've successfully set up our store.

### Master Routes

Now that we've set up our store we need to add some basic routes in our `App` Component. One route that renders a `Home` component for the `/` route and a `Campaigns` for the `/campaigns` route. Open up `App.js` and add the following code:

```jsx
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

So with this code we are importing __Router, Route & Link__ from __React Router DOM__ to create a routing system with links, and trigger the loading of components when the url is at `/` & `/campaigns`. There is also an import of styles from the `styles.js` file, these are imported to add styling to the elements. Feel free to take a look at that file, if you are interested. This new code will break the app, because we are importing __Components__ that do not exist yet. Let's add those now.

#### Home Component

```jsx 
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
```

#### CampaignsComponent 

```jsx
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

Try it out in the browser, and see if the transitions from `/ - /campaigns` renders the new components correctly. We are finished with the `Home` component, but the `Campaigns` component seems like a good place to make API request to get Campaigns and then subscribe to the store for changes to `state.camapaigns`, but first we need to add a few Action Creators and an Async action request. 

### Action Creators and Async Action Requests

We should build out our Redux Actions before we finish our components. 

To do this we need to add code to handle setting, adding, replacing & removing campaigns.

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

<<<<<<< HEAD
We've setup our __Action Creators__, but we still need to create our __Async Actions__ for the campaigns. Since Redux works synchronously, Async actions require middleware library that allows our Redux store to handle async actions. We've used [Redux Thunk](https://github.com/gaearon/redux-thunk) in previous labs, and a great tool for the current job. Before we can use this though, we need to apply it to our store using the `applyMiddleware()` function in our `store.js`:
=======
We've setup our __Action Creators__, but we still need to create our __Async Actions__ for the campaigns. This will require some imports at the top of the file and a constant variable to hold our API url.

```jsx 
// ./src/actions/campaigns.js

import { 
    makingAPIRequest, 
    successfulAPIRequest, 
    unsuccessfulAPIRequest 
} from './apiRequestStatus';

const API_URL = 'http://localhost:3001/api';

// .... rest of code
```

Since Redux works synchronously, Async actions require middleware library that allows our Redux store to handle async actions. We've used [Redux Thunk](https://github.com/gaearon/redux-thunk) in previous labs, and a great tool for the current job. Before we can use this though, we need to apply it to our store using the `applyMiddleware()` function in our `store.js`:
>>>>>>> 2d5971f82b4f490564f8b17b7abdf325adcb75ce

```jsx 
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

Now we should be able to handle async actions. Let's go back to `./actions/campaigns.js` and add the following code. 

```javascript
// ./src/actions/campaigns 

// ... previous code 

// @ Async Actions
const API_URL = 'http://localhost:3001/api';

export const fetchCampaigns = () => {
    return dispatch => {
        return fetch(`${API_URL}/campaigns`)
            .then(response => response.json())
            .then(campaigns => {
                dispatch(setCampaigns(campaigns));
            })
            .catch(err => console.log(err));
    };
};

export const createCampaign = (campaign, routerHistory) => {
    return dispatch => {
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
                dispatch(addCampaign(campaign));
                routerHistory.replace(`/campaigns/${campaign.id}`);
            })
            .catch(err => console.log(err));
    };
};

export const updateCampaign = (campaign, routerHistory) => {
    return dispatch => {
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
            dispatch(replaceCampaign(campaign));
            routerHistory.replace(`/campaigns/${campaign.id}`);
        })
        .catch(err => console.log(err));
    };
};

export const deleteCampaign = (campaignId, routerHistory) => {
    return dispatch => {
        return fetch(`${API_URL}/campaigns/${campaignId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                dispatch(removeCampaign(campaignId));
                routerHistory.replace(`/campaigns`);
            }
        })
        .catch(err => unsuccessfulAPIRequest());
    };
};
```

Take a few minutes to look at this code. Most of it should be familiar, but notice that a few of the methods are being passed a `routerHistory` object that is then used to redirect upon completion. Also take a look at the test file `./test/actions/CampaignsActionsTests.js` to see how we used a mock API service to handle the fetch requests. This was set up to equal the same spec we used for our Rails API tests, so we know what responses we would recieve.

### Connecting Campaigns Component To Redux

Now that we have our actions in place let's connect our Campaigns Component to Redux store.

```jsx 
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

In the above code we are mapping `state.campaigns` as `campaigns` prop to the campaigns component. It is also passing the dispatch function `fetchCampaigns`, which we are using in `componentDidMount`. This code will not run at the moment, becuase we need to add the following components: `CampaignCard, CampaignDetail & CreateCampaignForm`.

#### CampaignCard

The CampaignCard component will be a very basic stateless component that just renders the individual info about a campaign to be displayed in a list. 

```jsx 
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

If we go to `/campaigns` now in the browser it should display the new CampaignCard, but if we click on the card it will break, because we need the CampaignDetail component to view an individual Campaign.

### CampaignDetail

The `CampaignDetail` component needs to connect to the __Redux__ store to get information about a single Campaign. It will use the prop of `match.url.params.campaignId` passed down from __React Router DOM__ to find a campaign with a matching id in the stores list of campaigns. We will also need to add an `EditCampaignForm` component and import our `deleteCampaign` action. Let's add the following code to `CampaignDetail.js` :

```jsx 
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

The `CampaignDetail` component should load in the browser now, but clicking on edit will fail. We need to crete the `CreateCampaignForm` and `EditCampaignForm` next'. 

### Campaign Forms

We are going to create a `CampaignForm` component first that both the `CreateCampaignForm` and `EditCampaignForm` components can pass props down to. 
The campaign form will take 4 required props (header, buttonTitle, onFormSubmit - callback function and history) and one optional (campaign). Here is the code for `CampaignForm`:

```jsx
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

```jsx

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

Now that these components are up, we should be able to view campaigns, create a new campaign, view an individual campaign, edit an existing campaign and delete a campaign. Are app is almost complete, but we are not creating, viewing, or deleteing comments yet. This will be done in the following lab, so be ready for a new challenge. Great job on following along and building a full stack CRUD app v1 is complete.

### Summary

In this lesson we learned how to use React, Redux, React Router Dom and Redux Thunk to build a fully featured React app that connects to a custom built Rails API. This has been intense adventure, and we've learned a ton. In the next lab we are going to be building out the comments section of the app, so take a breather and get ready to finish our Iron Starter MVP. 

![sleeping kitty](https://media.giphy.com/media/1ipNzZzpOav6w/giphy.gif)

<p class='util--hide'>View <a href='https://learn.co/lessons/iron-starter-part-one'>Iron Starter Part One</a> on Learn.co and start learning to code for free.</p>
