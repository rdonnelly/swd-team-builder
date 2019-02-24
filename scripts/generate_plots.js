#!/usr/bin/env node

import * as _ from 'lodash';
import checksum from 'json-checksum';
import jsonfile from 'jsonfile';
import path from 'path';

import dbSetAw from 'swdestinydb-json-data/set/AW.json';
import dbSetSoR from 'swdestinydb-json-data/set/SoR.json';
import dbSetEaW from 'swdestinydb-json-data/set/EaW.json';
import dbSetTPG from 'swdestinydb-json-data/set/TPG.json';
import dbSetLEG from 'swdestinydb-json-data/set/LEG.json';
import dbSetRIV from 'swdestinydb-json-data/set/RIV.json';
import dbSetWotF from 'swdestinydb-json-data/set/WotF.json';
import dbSetAtG from 'swdestinydb-json-data/set/AtG.json';
import dbSetConv from 'swdestinydb-json-data/set/CONV.json';
import dbSetAoN from 'swdestinydb-json-data/set/AoN.json';

const plotsStats = {
  affiliations: [],
  count: 0,
  factions: [],
  maxPoints: 0,
  minPoints: 1000,
};

let plots =
  [].concat(
    dbSetAw,
    dbSetSoR,
    dbSetEaW,
    dbSetTPG,
    dbSetLEG,
    dbSetRIV,
    dbSetWotF,
    dbSetAtG,
    dbSetConv,
    dbSetAoN,
  ).filter(
    (rawCard) => rawCard.type_code === 'plot',
  ).map(
    (rawCard) => {
      const card = {};

      card.affiliation = rawCard.affiliation_code;
      card.faction = rawCard.faction_code;
      card.id = rawCard.code;
      card.name = rawCard.name;
      card.points = parseInt(rawCard.points, 10);
      card.set = rawCard.set_code;

      if (card.points < plotsStats.minPoints) {
        plotsStats.minPoints = card.points;
      }
      if (card.points > plotsStats.maxPoints) {
        plotsStats.maxPoints = card.points;
      }

      plotsStats.affiliations.push(card.affiliation);
      plotsStats.affiliations = _.uniq(plotsStats.affiliations);

      plotsStats.factions.push(card.faction);
      plotsStats.factions = _.uniq(plotsStats.factions);

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
    affiliation: card.affiliation,
    faction: card.faction,
    id: card.id,
    name: card.name,
    points: card.points,
    set: card.set,

    rank: index,
  }));

const plotsObject = {};
plots.forEach((plot) => {
  plotsObject[plot.id] = plot;
});

plotsStats.count = plots.length || 0;


console.log(`Output ${plots.length} plots...`); // eslint-disable-line no-console
jsonfile.writeFile(path.join(__dirname, '../data/plots.json'), plotsObject);
jsonfile.writeFile(path.join(__dirname, '../data/plots_stats.json'), plotsStats);
jsonfile.writeFile(path.join(__dirname, '../data/plots_checksum.json'), {
  checksum: checksum(plots),
  stats_checksum: checksum(plotsStats),
});
