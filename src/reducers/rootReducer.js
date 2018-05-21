import { combineReducers } from 'redux';

// import { tabBarReducer } from '../navigation/TabBarNavigation';

import charactersReducer from './charactersReducer';
import deckReducer from './deckReducer';
import teamsReducer from './teamsReducer';

const rootReducer = combineReducers({
  // tabNavigation: tabBarReducer,

  characters: charactersReducer,
  deck: deckReducer,
  teams: teamsReducer,
});

export default rootReducer;
