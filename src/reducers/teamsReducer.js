import {
  teams,
  teamsStats,

  affiliations,
  factions,
  damageTypes,
  sets,
} from '../lib/Destiny';


const initialState = {
  teams,
  settings: {
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
  },
};

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER': {
      const filters = {
        ...state.settings.filters,
      };

      filters[action.payload.key] = action.payload.value;

      return {
        ...state,
        settings: {
          ...state.settings,
          filters,
        },
      };
    }

    case 'SET_SORT': {
      const priority = action.payload.sortPriority;
      const sortOrder = initialState.settings.sortOrder.slice(0);

      sortOrder.sort((a, b) => {
        if (a === priority) return -1;
        if (b === priority) return 1;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      return {
        ...state,
        sortOrder,
      };
    }

    default:
      return state;
  }
};

export default teamsReducer;
