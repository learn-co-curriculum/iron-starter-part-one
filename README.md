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
import apiRequestStatus from '../reducers/apiRequestStatus';

const reducers = combineReducers({
    apiRequestStatus,
    campaigns,
});

export default createStore(
    reducers, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // <- Used for debuggin the code in your browser with Redux Devtools Chrome extendsion. 
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


### Summary

In this lesson we learned how to use React, Redux, React Router Dom and Redux Thunk to build a fully featured React app that connect to a custom built Rails API. This has been intense adventure, and we've learned a ton. In the next lab we are going to be building out the comments section of the app, so take a breather and get ready to finish our Iron Starter MVP. 

<p class='util--hide'>View <a href='https://learn.co/lessons/iron-starter-part-one'>Iron Starter Part One</a> on Learn.co and start learning to code for free.</p>