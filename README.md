# Iron Starter Part One

## Objectives

* Build React APP with CRUD for Campaigns using React, Redux & React Router Dom
* Integrate Redux Thunk into Redux Store to handle async API calls

## Introduction:

Congratulations on making it this far. We've learned a ton about Rails 5 API template and connecting it to a client app with React. In this lesson we are going to be building a full CRUD app to see how to connect all of the tools that we've learned thus far. 

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

### Summary

In this lesson we learned how to use React, Redux, React Router Dom and Redux Thunk to build a fully featured React app that connect to a custom built Rails API. This has been intense adventure, and we've learned a ton. In the next lab we are going to be building out the comments section of the app, so take a breather and get ready to finish our Iron Starter MVP. 

<p class='util--hide'>View <a href='https://learn.co/lessons/iron-starter-part-one'>Iron Starter Part One</a> on Learn.co and start learning to code for free.</p>