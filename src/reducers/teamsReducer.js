import Immutable from 'immutable';

import { teams } from '../lib/Destiny';


const initialState = Immutable.fromJS({
  teams,
  count: teams.count(),
  team: Immutable.fromJS([]),
});

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TEAMS': {
      const newTeams = state.get('teams')
        .filter(team =>
          action.payload.deckCards.every((characterObj) => {
            const character = team.get('characters')
              .find(teamCharacter =>
                teamCharacter.get('id') === characterObj.get('id') &&
                teamCharacter.get('isElite') === characterObj.get('isElite'));
            return character !== undefined && character.get('count') >= characterObj.get('count');
          }),
        );

      return state
        .set('teams', newTeams)
        .set('count', newTeams.count());
    }

    case 'REFRESH_TEAMS': {
      const newTeams = initialState.get('teams')
        .filter(team =>
          action.payload.deckCards.every((characterObj) => {
            const character = team.get('characters')
              .find(teamCharacter =>
                teamCharacter.get('id') === characterObj.get('id') &&
                teamCharacter.get('isElite') === characterObj.get('isElite'));
            return character !== undefined && character.get('count') >= characterObj.get('count');
          }),
        );

      return state
        .set('teams', newTeams)
        .set('count', newTeams.count());
    }

    default:
      return state;
  }
};

export default teamsReducer;
