import {
  teamsStats,

  affiliations,
  damageTypes,
  factions,
  sets,
} from '../../lib/Destiny';


const initialState = {
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
      plotFactions: {
        blue: false,
        gray: true,
        red: false,
        yellow: false,
      },

      affiliations: affiliations.reduce((affiliationMap, affiliation) => ({
        ...affiliationMap,
        [affiliation.code]: true,
      }), {}),
      damageTypes: damageTypes.reduce((damageTypeMap, damageType) => ({
        ...damageTypeMap,
        [damageType.code]: true,
      }), {}),
      factions: factions.reduce((factionMap, faction) => ({
        ...factionMap,
        [faction.code]: true,
      }), {}),
      formats: {
        // INF: true,
        STD: true,
        TRI: false,
      },
      sets: sets.reduce((setMap, set) => ({
        ...setMap,
        [set.code]: true,
      }), {}),
    },
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
