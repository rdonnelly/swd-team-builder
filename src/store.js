import ReduxThunk from 'redux-thunk';

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';

import { tabBarReducer } from './components/TabBar/navigationConfiguration';

import { CharacterNavigator } from './screens/Characters/navigationConfiguration';
import { TeamNavigator } from './screens/Teams/navigationConfiguration';
import { SettingsNavigator } from './screens/Settings/navigationConfiguration';

import charactersReducer from './reducers/charactersReducer';
import deckReducer from './reducers/deckReducer';
import teamsReducer from './reducers/teamsReducer';


// STORE REDUCERS
const rootReducer = combineReducers({
  tabBar: tabBarReducer,

  charactersTab: (state, action) => CharacterNavigator.router.getStateForAction(action, state),
  teamsTab: (state, action) => TeamNavigator.router.getStateForAction(action, state),
  settingsTab: (state, action) => SettingsNavigator.router.getStateForAction(action, state),

  characters: charactersReducer,
  deck: deckReducer,
  teams: teamsReducer,
});

// PRELOADED / INITIAL STATE
const preloadedState = {};

// ENHANCER / MIDDLEWARE
const middleware = [
  ReduxThunk,
  createLogger(),
];

const enhancer = applyMiddleware(...middleware);

export default createStore(rootReducer, preloadedState, enhancer);
