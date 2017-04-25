import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { tabBarReducer } from './components/TabBar/navigationConfiguration';
import { SearchNavigator } from './components/Search/navigationConfiguration';
import { ResultsNavigator } from './components/Results/navigationConfiguration';

import deckReducer from './reducers/deckReducer';
import teamsReducer from './reducers/teamsReducer';


const middleware = [
  thunk,
  createLogger(),
];

export default createStore(
  combineReducers({
    tabBar: tabBarReducer,
    searchTab: (state, action) => SearchNavigator.router.getStateForAction(action, state),
    resultsTab: (state, action) => ResultsNavigator.router.getStateForAction(action, state),

    deckReducer,
    teamsReducer,
  }),
  applyMiddleware(...middleware),
);
