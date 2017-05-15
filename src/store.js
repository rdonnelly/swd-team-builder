import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { tabBarReducer } from './components/TabBar/navigationConfiguration';
import { CharactersNavigator } from './components/Characters/navigationConfiguration';
import { SettingsNavigator } from './components/Settings/navigationConfiguration';
import { TeamsNavigator } from './components/Teams/navigationConfiguration';

import charactersReducer from './reducers/charactersReducer';
import deckReducer from './reducers/deckReducer';
import teamsReducer from './reducers/teamsReducer';


const middleware = [
  thunk,
  createLogger(),
];

export default createStore(
  combineReducers({
    tabBar: tabBarReducer,
    charactersTab: (state, action) => CharactersNavigator.router.getStateForAction(action, state),
    settingsTab: (state, action) => SettingsNavigator.router.getStateForAction(action, state),
    teamsTab: (state, action) => TeamsNavigator.router.getStateForAction(action, state),

    charactersReducer,
    deckReducer,
    teamsReducer,
  }),
  applyMiddleware(...middleware),
);
