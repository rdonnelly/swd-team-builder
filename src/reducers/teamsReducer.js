import Immutable from 'immutable';

import { teams, teamsStatsData } from '../lib/Destiny';


const initialState = Immutable.fromJS({
  teams,
  count: teams.count(),
  settings: {
    minPoints: teamsStatsData.minPoints,
    maxPoints: teamsStatsData.maxPoints,

    minDice: teamsStatsData.minDice,
    maxDice: teamsStatsData.maxDice,

    minHealth: teamsStatsData.minHealth,
    maxHealth: teamsStatsData.maxHealth,

    mixedDamage: true,
  },
});

const filterTeamsByCharacters = (teamsToFilter, deckCards) =>
  teamsToFilter.filter(team =>
    deckCards.every((characterObj) => {
      const character = team.get('characters')
        .find(teamCharacter =>
          teamCharacter.get('id') === characterObj.get('id') &&
          teamCharacter.get('isElite') === characterObj.get('isElite'));
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

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RECALCULATE_TEAMS': {
      let filteredTeams = initialState.get('teams');
      filteredTeams = filterTeamsBySettings(filteredTeams, state.get('settings'));
      filteredTeams = filterTeamsByCharacters(filteredTeams, action.payload.deckCards);

      return state
        .set('teams', filteredTeams)
        .set('count', filteredTeams.count());
    }

    case 'RESET_TEAMS': {
      return state
        .set('teams', initialState.get('teams'))
        .set('count', initialState.get('count'));
    }

    case 'SET_SETTING': {
      const settings = state.get('settings').set(action.payload.key, action.payload.value);

      return state.set('settings', settings);
    }

    default:
      return state;
  }
};

export default teamsReducer;
