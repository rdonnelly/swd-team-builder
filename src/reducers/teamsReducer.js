import Immutable from 'immutable';

import { teams, teamsStatsData } from '../lib/Destiny';

const initialSettings = Immutable.fromJS({
  minPoints: Math.max(teamsStatsData.minPoints, 27),
  maxPoints: teamsStatsData.maxPoints,

  minDice: Math.max(teamsStatsData.minDice, 2),
  maxDice: teamsStatsData.maxDice,

  minHealth: Math.max(teamsStatsData.minHealth, 15),
  maxHealth: teamsStatsData.maxHealth,

  mixedDamage: true,
});

const initialSortOrder = Immutable.fromJS([
  'dice', 'health', 'points',
]);

const filterTeamsByCharacters = (teamsToFilter, deckCards) =>
  teamsToFilter.filter(team =>
    deckCards.every((characterObj) => {
      const character = team.get('characters')
        .find((teamCharacter) => {
          if (teamCharacter.get('id') !== characterObj.get('id')) {
            return false;
          }

          if (characterObj.get('isElite') !== null &&
              teamCharacter.get('isElite') !== characterObj.get('isElite')) {
            return false;
          }

          return true;
        });
      return character !== undefined && character.get('count') >= characterObj.get('count');
    }),
  );

const filterTeamsBySettings = (teamsToFilter, settings) =>
  teamsToFilter.filter((team) => {
    const minPoints = settings.get('minPoints');
    const maxPoints = settings.get('maxPoints');
    const minDice = settings.get('minDice');
    const maxDice = settings.get('maxDice');
    const minHealth = settings.get('minHealth');
    const showMixedDamage = settings.get('mixedDamage');

    if (team.get('points') < minPoints) {
      return false;
    }

    if (team.get('points') > maxPoints) {
      return false;
    }

    if (team.get('dice') < minDice) {
      return false;
    }

    if (team.get('dice') > maxDice) {
      return false;
    }

    if (team.get('health') < minHealth) {
      return false;
    }

    if (!showMixedDamage &&
      team.get('damageTypes').count() > 1) {
      return false;
    }

    return true;
  });

const sortTeams = (teamsToSort, sortOrder) =>
  teamsToSort.sort((a, b) => {
    let sortValue = b.get('characters').count() - a.get('characters').count();

    const sortValues = {
      points: b.get('points') - a.get('points'),
      dice: b.get('dice') - a.get('dice'),
      health: b.get('health') - a.get('health'),
    };

    sortOrder.every((sortKey) => {
      if (sortValues[sortKey]) {
        sortValue = sortValues[sortKey];
        return false;
      }

      return true;
    });

    return sortValue;
  });

const getInitialTeams = () => {
  let initialTeams = teams;
  initialTeams = filterTeamsBySettings(initialTeams, initialSettings);
  initialTeams = sortTeams(initialTeams, initialSortOrder);
  return initialTeams;
};

const initialState = Immutable.fromJS({
  teams: getInitialTeams(),
  settings: initialSettings,
  sortOrder: initialSortOrder,
});

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RECALCULATE_TEAMS': {
      let newTeams = Immutable.fromJS(teams);
      newTeams = filterTeamsByCharacters(newTeams, action.payload.deckCards);
      newTeams = filterTeamsBySettings(newTeams, state.get('settings'));
      newTeams = sortTeams(newTeams, state.get('sortOrder'));
      return state.set('teams', newTeams);
    }

    case 'RESET_TEAMS': {
      return state
        .set('teams', filterTeamsBySettings(Immutable.fromJS(teams), state.get('settings')));
    }

    case 'SET_SETTING': {
      const settings = state.get('settings').set(action.payload.key, action.payload.value);
      return state.set('settings', settings);
    }

    case 'SET_SORT': {
      const priority = action.payload.sortPriority;
      const sortOrder = initialSortOrder.sort((a, b) => {
        if (a === priority) return -1;
        if (b === priority) return 1;
        return 0;
      });

      return state.set('sortOrder', sortOrder);
    }

    default:
      return state;
  }
};

export default teamsReducer;
