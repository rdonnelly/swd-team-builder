import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { tabBarReducer } from './components/TabBar/navigationConfiguration';

import { CharacterNavigator } from './screens/Characters/navigationConfiguration';
import { TeamNavigator } from './screens/Teams/navigationConfiguration';
import { SettingsNavigator } from './screens/Settings/navigationConfiguration';

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

    charactersTab: (state, action) => CharacterNavigator.router.getStateForAction(action, state),
    teamsTab: (state, action) => TeamNavigator.router.getStateForAction(action, state),
    settingsTab: (state, action) => SettingsNavigator.router.getStateForAction(action, state),

    charactersReducer,
    deckReducer,
    teamsReducer,
  }),
  applyMiddleware(...middleware),
);
