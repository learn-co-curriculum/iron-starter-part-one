import { applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk';
import campaigns from './reducers/campaignsReducer';

const reducers = combineReducers({
  campaigns,
});

const middleware = [thunk];

export default createStore(
    reducers, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(...middleware)
);