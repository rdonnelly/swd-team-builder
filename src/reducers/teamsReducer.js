import Immutable from 'immutable';

import { teams } from '../lib/Destiny';


const initialState = Immutable.fromJS({
  teams,
  count: teams.count(),
  team: Immutable.fromJS([]),
});

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CARD_TO_DECK': {
      let newTeam = state.get('team');
      const characterIndex = state.get('team').findKey(character => character.get('id') === action.payload.card.get('id'));

      if (characterIndex === undefined) {
        newTeam = newTeam.push(Immutable.fromJS({
          id: action.payload.card.id,
          name: action.payload.card.name,
          isElite: action.payload.isElite,
          count: 1,
        }));
      } else {
        newTeam = newTeam.update(characterIndex, (character) => {
          const newCharacter = character.update('count', count => count + 1);
          return newCharacter;
        });
      }

      const newTeams = state.get('teams')
        .filter(team =>
          newTeam.every((characterObj) => {
            const character = team.get('characters').find(teamCharacter => teamCharacter.get('id') === characterObj.get('id'));
            return character !== undefined && character.get('count') >= characterObj.get('count');
          }),
        );

      return state
        .set('teams', newTeams)
        .set('count', newTeams.count())
        .set('team', newTeam);
    }

    default:
      return state;
  }
};

export default teamsReducer;
