import Immutable from 'immutable';

import { characterCards } from '../lib/Destiny';

const affiliationOrder = Immutable.fromJS({
  villain: 0,
  hero: 1,
  neutral: 2,
});

const factionOrder = Immutable.fromJS({
  red: 0,
  blue: 1,
  yellow: 2,
});


const characters = characterCards
  .sort((a, b) => {
    if (a.affiliation !== b.affiliation) {
      return affiliationOrder.get(a.affiliation) - affiliationOrder.get(b.affiliation);
    }

    if (a.faction !== b.faction) {
      return factionOrder.get(a.faction) - factionOrder.get(b.faction);
    }

    if (a.isUnique !== b.isUnique) {
      return a.isUnique ? -1 : 1;
    }

    if (a.name !== b.name) {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : 1;
    }

    return 0;
  })
  .map(card => ({
    id: card.id,
    name: card.name,
    set: card.set,
    affiliation: card.affiliation,
    isCompatibile: true,
  }));

const initialState = Immutable.fromJS(characters);

const charactersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHARACTERS': {
      return state.map((characterObject) => {
        const hasValidAffiliation =
          characterObject.get('affiliation') === 'neutral' ||
          action.payload.deckAffiliation === 'neutral' ||
          characterObject.get('affiliation') === action.payload.deckAffiliation;
        const hasValidSet = action.payload.sets.includes(characterObject.get('set'));
        return characterObject.set('isCompatibile', hasValidAffiliation && hasValidSet);
      })
        ;
    }

    case 'RESET_CHARACTERS': {
      return initialState;
    }

    default:
      return state;
  }
};

export default charactersReducer;
