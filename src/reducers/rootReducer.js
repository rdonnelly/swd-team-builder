import { combineReducers } from 'redux';

import charactersReducer from './charactersReducer';
import deckReducer from './deckReducer';
import teamsReducer from './teamsReducer';

const rootReducer = combineReducers({
  characters: charactersReducer,
  deck: deckReducer,
  teams: teamsReducer,
});

export default rootReducer;
