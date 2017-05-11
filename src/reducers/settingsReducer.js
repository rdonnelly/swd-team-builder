import Immutable from 'immutable';

import { teamsStatsData } from '../lib/Destiny';


const initialState = Immutable.fromJS({
  minPoints: teamsStatsData.minPoints,
  maxPoints: teamsStatsData.maxPoints,

  minDice: teamsStatsData.minDice,
  maxDice: teamsStatsData.maxDice,

  minHealth: teamsStatsData.minHealth,
  maxHealth: teamsStatsData.maxHealth,

  mixedDamage: true,
});

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SETTING': {
      return state.set(action.payload.key, action.payload.value);
    }

    default:
      return state;
  }
};

export default settingsReducer;
