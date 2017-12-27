import ReduxThunk from 'redux-thunk';

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';

import { tabBarReducer } from './navigation/TabBarNavigation';

import charactersReducer from './reducers/charactersReducer';
import deckReducer from './reducers/deckReducer';
import teamsReducer from './reducers/teamsReducer';


// STORE REDUCERS
const rootReducer = combineReducers({
  tabNavigation: tabBarReducer,

  characters: charactersReducer,
  deck: deckReducer,
  teams: teamsReducer,
});

// PRELOADED / INITIAL STATE
const preloadedState = {};

// ENHANCER / MIDDLEWARE
const middleware = [
  ReduxThunk,
  __DEV__ && createLogger(), // eslint-disable-line no-undef
].filter(Boolean);

const enhancer = applyMiddleware(...middleware);

const store = createStore(rootReducer, preloadedState, enhancer);

export default store;
