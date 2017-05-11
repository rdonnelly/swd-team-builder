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
import teamsStatsData from '../../data/teams_stats.json';


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

export {
  cards,
  teams,
  teamsStatsData,

  cardAffiliations,
  cardFactions,
  cardRarities,
  cardSets,
  cardSideTypes,
  cardSubTypes,
  cardTypes,
};
