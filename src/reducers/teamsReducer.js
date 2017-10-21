import Immutable from 'immutable';

import { damageTypes, sets, teams, teamsStats } from '../lib/Destiny';


const initialState = Immutable.fromJS({
  teams,
  settings: {
    minPoints: Math.max(teamsStats.minPoints, 27),
    maxPoints: teamsStats.maxPoints,

    minDice: Math.max(teamsStats.minDice, 2),
    maxDice: teamsStats.maxDice,

    minHealth: Math.max(teamsStats.minHealth, 15),
    maxHealth: teamsStats.maxHealth,

    damageTypes: damageTypes.map(damageType => damageType.code),

    sets: sets.map(set => set.code),
  },
  sortOrder: [
    'dice', 'health', 'points', 'characterCount',
  ],
});

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SETTING': {
      return state.setIn(['settings', action.payload.key], action.payload.value);
    }

    case 'SET_SETTING_DAMAGE_TYPES': {
      return state.updateIn(['settings', 'damageTypes'], (settingDamageTypes) => {
        if (action.payload.value) {
          return settingDamageTypes.push(action.payload.key);
        }

        return settingDamageTypes.filterNot(setCode => setCode === action.payload.key);
      });
    }

    case 'SET_SETTING_SETS': {
      return state.updateIn(['settings', 'sets'], (settingSets) => {
        if (action.payload.value) {
          return settingSets.push(action.payload.key);
        }

        return settingSets.filterNot(setCode => setCode === action.payload.key);
      });
    }

    case 'SET_SORT': {
      const priority = action.payload.sortPriority;
      const sortOrder = initialState.get('sortOrder').sort((a, b) => {
        if (a === priority) return -1;
        if (b === priority) return 1;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      return state.set('sortOrder', sortOrder);
    }

    default:
      return state;
  }
};

export default teamsReducer;
