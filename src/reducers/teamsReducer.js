import Immutable from 'immutable';

import { teams } from '../lib/Destiny';


const initialState = Immutable.fromJS({
  teams,
  count: teams.count(),
});

const filterTeamsByCharacters = (newTeams, deckCards) =>
  newTeams.filter(team =>
    deckCards.every((characterObj) => {
      const character = team.get('characters')
        .find(teamCharacter =>
          teamCharacter.get('id') === characterObj.get('id') &&
          teamCharacter.get('isElite') === characterObj.get('isElite'));
      return character !== undefined && character.get('count') >= characterObj.get('count');
    }),
  );

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REFINE_TEAMS': {
      const newTeams = filterTeamsByCharacters(
        state.get('teams'),
        action.payload.deckCards,
      );

      return state
        .set('teams', newTeams)
        .set('count', newTeams.count());
    }

    case 'RECALCULATE_TEAMS': {
      const newTeams = filterTeamsByCharacters(
        initialState.get('teams')
          .filter((team) => {
            const minPoints = action.payload.settings.get('minPoints');
            const maxPoints = action.payload.settings.get('maxPoints');
            const minDice = action.payload.settings.get('minDice');
            const maxDice = action.payload.settings.get('maxDice');
            const minHealth = action.payload.settings.get('minHealth');
            const showMixedDamage = action.payload.settings.get('mixedDamage');

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
          }),
        action.payload.deckCards,
      );

      return state
        .set('teams', newTeams)
        .set('count', newTeams.count());
    }

    case 'RESET_TEAMS': {
      return state
        .set('teams', initialState.get('teams'))
        .set('count', initialState.get('count'));
    }

    default:
      return state;
  }
};

export default teamsReducer;
