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

import teamsData from '../../data/teams.json';


const cardAffiliations = Immutable.fromJS(dbCardAffiliations);
const cardFactions = Immutable.fromJS(dbCardFactions);
const cardRarities = Immutable.fromJS(dbCardRarities);
const cardSets = Immutable.fromJS(dbCardSets);
const cardSideTypes = Immutable.fromJS(dbCardSideTypes);
const cardSubTypes = Immutable.fromJS(dbCardSubTypes);
const cardTypes = Immutable.fromJS(dbCardTypes);


class Card {
  constructor(
    affiliation,
    cost,
    faction,
    flavorText,
    health,
    id,
    illustrator,
    isUnique,
    limit,
    name,
    points,
    rarity,
    set,
    sides,
    type,
  ) {
    this.affiliation = affiliation;
    this.cost = cost;
    this.faction = faction;
    this.flavorText = flavorText;
    this.health = health;
    this.id = id;
    this.illustrator = illustrator;
    this.isUnique = isUnique;
    this.limit = limit;
    this.name = name;

    this.points = 0;
    this.pointsRegular = 0;
    this.pointsElite = 0;
    if (points) {
      this.points = points.split('/').map(v => parseInt(v, 10));
      this.pointsRegular = this.points[0];
      this.pointsElite = this.points[1];
    }

    this.rarity = rarity;
    this.set = set;
    this.sides = sides;
    this.type = type;
  }

  get(key) {
    if (this[key]) {
      return this[key];
    }

    return null;
  }
}

const cards = Immutable.fromJS([]
    .concat(dbCardSetAw, dbCardSetSoR))
    .map(card => new Card(
      card.get('affiliation_code'),
      card.get('cost'),
      card.get('faction_code'),
      card.get('flavor'),
      card.get('health'),
      card.get('code'),
      card.get('illustrator'),
      card.get('is_unique'),
      card.get('deck_limit'),
      card.get('name'),
      card.get('points'),
      card.get('rarity_code'),
      card.get('set_code'),
      card.get('sides'),
      card.get('type_code'),
    ))
    .reduce(
      (result, item) => result.set(item.get('id'), item),
      Immutable.OrderedMap(),
    );

const teams = Immutable.fromJS(teamsData);

const cardImages = Immutable.fromJS({
  '01001': require('../../images/characters/01001.jpg'),
  '01002': require('../../images/characters/01002.jpg'),
  '01003': require('../../images/characters/01003.jpg'),
  '01004': require('../../images/characters/01004.jpg'),
  '01009': require('../../images/characters/01009.jpg'),
  '01010': require('../../images/characters/01010.jpg'),
  '01011': require('../../images/characters/01011.jpg'),
  '01012': require('../../images/characters/01012.jpg'),
  '01019': require('../../images/characters/01019.jpg'),
  '01020': require('../../images/characters/01020.jpg'),
  '01021': require('../../images/characters/01021.jpg'),
  '01022': require('../../images/characters/01022.jpg'),
  '01027': require('../../images/characters/01027.jpg'),
  '01028': require('../../images/characters/01028.jpg'),
  '01029': require('../../images/characters/01029.jpg'),
  '01030': require('../../images/characters/01030.jpg'),
  '01035': require('../../images/characters/01035.jpg'),
  '01036': require('../../images/characters/01036.jpg'),
  '01037': require('../../images/characters/01037.jpg'),
  '01038': require('../../images/characters/01038.jpg'),
  '01045': require('../../images/characters/01045.jpg'),
  '01046': require('../../images/characters/01046.jpg'),
  '01047': require('../../images/characters/01047.jpg'),
  '01048': require('../../images/characters/01048.jpg'),
  '02001': require('../../images/characters/02001.jpg'),
  '02002': require('../../images/characters/02002.jpg'),
  '02003': require('../../images/characters/02003.jpg'),
  '02004': require('../../images/characters/02004.jpg'),
  '02009': require('../../images/characters/02009.jpg'),
  '02010': require('../../images/characters/02010.jpg'),
  '02011': require('../../images/characters/02011.jpg'),
  '02012': require('../../images/characters/02012.jpg'),
  '02018': require('../../images/characters/02018.jpg'),
  '02019': require('../../images/characters/02019.jpg'),
  '02020': require('../../images/characters/02020.jpg'),
  '02021': require('../../images/characters/02021.jpg'),
  '02026': require('../../images/characters/02026.jpg'),
  '02027': require('../../images/characters/02027.jpg'),
  '02028': require('../../images/characters/02028.jpg'),
  '02029': require('../../images/characters/02029.jpg'),
  '02034': require('../../images/characters/02034.jpg'),
  '02035': require('../../images/characters/02035.jpg'),
  '02036': require('../../images/characters/02036.jpg'),
  '02037': require('../../images/characters/02037.jpg'),
  '02043': require('../../images/characters/02043.jpg'),
  '02044': require('../../images/characters/02044.jpg'),
  '02045': require('../../images/characters/02045.jpg'),
  '02046': require('../../images/characters/02046.jpg'),
});

export {
  cards,
  teams,

  cardImages,

  cardAffiliations,
  cardFactions,
  cardRarities,
  cardSets,
  cardSideTypes,
  cardSubTypes,
  cardTypes,
};
