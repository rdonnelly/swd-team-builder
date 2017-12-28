import Immutable from 'immutable';

import {
  teams,
  teamsStats,

  affiliations,
  factions,
  damageTypes,
  sets,
} from '../lib/Destiny';


const initialState = {
  teams: Immutable.fromJS(teams),
  settings: Immutable.fromJS({
    filters: {
      minDice: Math.max(teamsStats.minDice, 2),
      maxDice: teamsStats.maxDice,

      minHealth: Math.max(teamsStats.minHealth, 15),
      maxHealth: teamsStats.maxHealth,

      minPoints: Math.max(teamsStats.minPoints, 23),
      maxPoints: teamsStats.maxPoints,

      minCharacterCount: Math.max(teamsStats.minCharacterCount, 1),
      maxCharacterCount: teamsStats.maxCharacterCount,

      affiliations: affiliations.map(affiliation => affiliation.code),
      damageTypes: damageTypes.map(damageType => damageType.code),
      factions: factions.map(faction => faction.code),
      sets: sets.map(set => set.code),
    },
    sortOrder: [
      'dice', 'health', 'points', 'characterCount',
    ],
  }),
};

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER': {
      return Object.assign({}, state, {
        settings: state.settings.setIn(['filters', action.payload.key], action.payload.value),
      });
    }

    case 'SET_SORT': {
      const priority = action.payload.sortPriority;
      const sortOrder = initialState.settings.get('sortOrder').sort((a, b) => {
        if (a === priority) return -1;
        if (b === priority) return 1;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      return Object.assign({}, state, {
        settings: state.settings.set('sortOrder', sortOrder),
      });
    }

    default:
      return state;
  }
};

export default teamsReducer;
