import Immutable from 'immutable';

import { teams } from '../lib/Destiny';


const initialState = Immutable.fromJS({
  teams,
  count: teams.count(),
});

const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CARD_TO_DECK': {
      const newTeams = state.get('teams')
        .filter(team => team.get('characters').map(character => character.get('id')).includes(action.payload.card.get('id')))
        .filter(team => team.get('characters').map(character => character.get('isElite')).includes(action.payload.isElite));

      return state
        .set('teams', newTeams)
        .set('count', newTeams.count());
    }

    default:
      return state;
  }
};

export default teamsReducer;
