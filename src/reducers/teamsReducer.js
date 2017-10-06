import Immutable from 'immutable';

import { sets, teams, teamsStats } from '../lib/Destiny';

const filterTeamsByCharacters = (teamsToFilter, deckCards) =>
  teamsToFilter.filter(team =>
    deckCards.every((characterObject) => {
      const character = team.get('characters')
        .find((teamCharacter) => {
          if (teamCharacter.get('id') !== characterObject.get('id')) {
            return false;
          }

          if (characterObject.get('isElite') !== null &&
              teamCharacter.get('isElite') !== characterObject.get('isElite')) {
            return false;
          }

          return true;
        });

      return character !== undefined && character.get('count') >= characterObject.get('count');
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
    const showSets = settings.get('showSets');

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

    if (!showMixedDamage && team.get('damageTypes').count() > 1) {
      return false;
    }

    if (!team.get('sets').isSubset(showSets)) {
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
      if (sortValues[sortKey] !== 0) {
        sortValue = sortValues[sortKey];
        return false;
      }

      return true;
    });

    return sortValue;
  });

const initialSettings = Immutable.fromJS({
  minPoints: Math.max(teamsStats.minPoints, 27),
  maxPoints: teamsStats.maxPoints,

  minDice: Math.max(teamsStats.minDice, 2),
  maxDice: teamsStats.maxDice,

  minHealth: Math.max(teamsStats.minHealth, 15),
  maxHealth: teamsStats.maxHealth,

  mixedDamage: true,

  showSets: sets.map(set => set.code),
});

const initialSortOrder = Immutable.fromJS([
  'dice', 'health', 'points',
]);

const preloadedTeams = Immutable.fromJS(teams);

const getInitialTeams = (startingTeams) => {
  let initialTeams = startingTeams;
  initialTeams = filterTeamsBySettings(initialTeams, initialSettings);
  initialTeams = sortTeams(initialTeams, initialSortOrder);
  return initialTeams;
};

const initialState = Immutable.fromJS({
  teams: getInitialTeams(preloadedTeams),
  settings: initialSettings,
  sortOrder: initialSortOrder,
});

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RECALCULATE_TEAMS': {
      let newTeams = preloadedTeams;
      newTeams = filterTeamsByCharacters(newTeams, action.payload.deckCards);
      newTeams = filterTeamsBySettings(newTeams, state.get('settings'));
      newTeams = sortTeams(newTeams, state.get('sortOrder'));
      return state.set('teams', newTeams);
    }

    case 'RESET_TEAMS': {
      return state
        .set('teams', filterTeamsBySettings(preloadedTeams, state.get('settings')));
    }

    case 'SET_SETTING': {
      return state.update('settings', settings => settings.set(action.payload.key, action.payload.value));
    }

    case 'SET_SORT': {
      const priority = action.payload.sortPriority;
      const sortOrder = initialSortOrder.sort((a, b) => {
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
