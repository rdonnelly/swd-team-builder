import Immutable from 'immutable';

import dbCardAffiliations from 'swdestinydb-json-data/affiliations.json';
import dbCardFactions from 'swdestinydb-json-data/factions.json';
import dbCardRarities from 'swdestinydb-json-data/rarities.json';
import dbCardSideTypes from 'swdestinydb-json-data/sideTypes.json';
import dbCardSubTypes from 'swdestinydb-json-data/subtypes.json';
import dbCardTypes from 'swdestinydb-json-data/types.json';

import dbCardSets from 'swdestinydb-json-data/sets.json';
import dbCardSetAw from 'swdestinydb-json-data/set/AW.json';
import dbCardSetSoR from 'swdestinydb-json-data/set/SoR.json';


const cardAffiliations = Immutable.fromJS(dbCardAffiliations);
const cardFactions = Immutable.fromJS(dbCardFactions);
const cardRarities = Immutable.fromJS(dbCardRarities);
const cardSideTypes = Immutable.fromJS(dbCardSideTypes);
const cardSubTypes = Immutable.fromJS(dbCardSubTypes);
const cardTypes = Immutable.fromJS(dbCardTypes);

class CardSets {
  constructor() {
    this.sets = Immutable.fromJS({});

    dbCardSets.forEach((setInfo) => {
      let set = Immutable.fromJS({
        date_release: setInfo.date_release,
        id: setInfo.code.toLowerCase(),
        name: setInfo.name,
        order: setInfo.position,
        size: setInfo.size,
      });

      if (setInfo.code === 'AW') {
        set = set.set('cards', Immutable.fromJS(dbCardSetAw));
      }

      if (setInfo.code === 'SoR') {
        set = set.set('cards', Immutable.fromJS(dbCardSetSoR));
      }

      this.sets = this.sets.set(set.get('id'), set);
    });
  }
}

export {
  CardSets,

  cardAffiliations,
  cardFactions,
  cardRarities,
  cardSideTypes,
  cardSubTypes,
  cardTypes,
};
