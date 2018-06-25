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
      minCharacterCount: Math.max(teamsStats.minCharacterCount, 1),
      maxCharacterCount: teamsStats.maxCharacterCount,

      minDice: teamsStats.minDice,
      maxDice: teamsStats.maxDice,

      minHealth: teamsStats.minHealth,
      maxHealth: teamsStats.maxHealth,

      minPoints: teamsStats.minPoints,
      maxPoints: teamsStats.maxPoints,

      plotPoints: 0,
      plotFactions: ['gray'],

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
        settings: {
          ...state.settings,
          sortOrder,
        },
      };
    }

    case 'RESET_FILTERS': {
      const filters = {
        ...initialState.settings.filters,
      };

      return {
        ...state,
        settings: {
          ...state.settings,
          filters,
        },
      };
    }

    default:
      return state;
  }
};

export default teamsReducer;
