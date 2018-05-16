#!/usr/bin/env node

import checksum from 'json-checksum';
import jsonfile from 'jsonfile';
import path from 'path';

import dbSetAw from 'swdestinydb-json-data/set/AW.json';
import dbSetSoR from 'swdestinydb-json-data/set/SoR.json';
import dbSetEaW from 'swdestinydb-json-data/set/EaW.json';
import dbSetTPG from 'swdestinydb-json-data/set/TPG.json';
import dbSetLEG from 'swdestinydb-json-data/set/LEG.json';
import dbSetRIV from 'swdestinydb-json-data/set/RIV.json';

const plotsStats = {
  minPoints: 1000,
  maxPoints: 0,
};

let plots =
  [].concat(
    dbSetAw,
    dbSetSoR,
    dbSetEaW,
    dbSetTPG,
    dbSetLEG,
    dbSetRIV,
  ).filter(
    rawCard => rawCard.type_code === 'plot',
  ).map(
    (rawCard) => {
      const card = {};

      card.affiliation = rawCard.affiliation_code;
      card.faction = rawCard.faction_code;
      card.id = rawCard.code;
      card.isUnique = rawCard.is_unique;
      card.limit = rawCard.deck_limit;
      card.name = rawCard.name;

      card.points = parseInt(rawCard.points, 10);

      card.rarity = rawCard.rarity_code;
      card.set = rawCard.set_code;
      card.type = rawCard.type_code;

      if (card.points < plotsStats.minPoints) {
        plotsStats.minPoints = card.points;
      }
      if (card.points > plotsStats.maxPoints) {
        plotsStats.maxPoints = card.points;
      }

      return card;
    },
  );

plots = plots
  .sort((a, b) => {
    if (a.points !== b.points) {
      return a.points - b.points;
    }

    if (a.name !== b.name) {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : 1;
    }

    return 0;
  });

plots = plots
  .map((card, index) => ({
    id: card.id,
    name: card.name,
    set: card.set,

    affiliation: card.affiliation,
    faction: card.faction,

    health: card.health,
    limit: card.limit,

    isUnique: card.isUnique,
    points: card.points,
    rarity: card.rarity,

    rank: index,
  }));

const plotsObject = {};
plots.forEach((plot) => {
  plotsObject[plot.id] = plot;
});




console.log(`Output ${plots.length} plots...`); // eslint-disable-line no-console
jsonfile.writeFile(path.join(__dirname, '../data/plots.json'), plotsObject);

jsonfile.writeFile(path.join(__dirname, '../data/plots_stats.json'), plotsStats);
jsonfile.writeFile(path.join(__dirname, '../data/plots_checksum.json'), {
  checksum: checksum(plots),
  stats_checksum: checksum(plotsStats),
});
