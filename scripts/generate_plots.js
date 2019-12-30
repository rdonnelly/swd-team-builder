#!/usr/bin/env node

import * as _ from 'lodash';
import checksum from 'json-checksum';
import jsonfile from 'jsonfile';
import path from 'path';

// import dbSetAw from 'swdestinydb-json-data/set/AW.json';
// import dbSetSoR from 'swdestinydb-json-data/set/SoR.json';
// import dbSetEaW from 'swdestinydb-json-data/set/EaW.json';
import dbSetTPG from 'swdestinydb-json-data/set/TPG.json';
import dbSetLEG from 'swdestinydb-json-data/set/LEG.json';
import dbSetRIV from 'swdestinydb-json-data/set/RIV.json';
import dbSetWotF from 'swdestinydb-json-data/set/WotF.json';
import dbSetAtG from 'swdestinydb-json-data/set/AtG.json';
import dbSetConv from 'swdestinydb-json-data/set/CONV.json';
import dbSetAoN from 'swdestinydb-json-data/set/AoN.json';
import dbSetSoH from 'swdestinydb-json-data/set/SoH.json';

import formats from 'swdestinydb-json-data/formats.json';

const affiliationOrder = {
  villain: 0,
  hero: 1,
  neutral: 2,
};

const factionOrder = {
  blue: 0,
  red: 1,
  yellow: 2,
  gray: 3,
};

const plotsStats = {
  affiliations: [],
  count: 0,
  factions: [],
  maxPoints: 0,
  minPoints: 1000,
};

let plots = []
  .concat(
    // dbSetAw,
    // dbSetSoR,
    // dbSetEaW,
    dbSetTPG,
    dbSetLEG,
    dbSetRIV,
    dbSetWotF,
    dbSetAtG,
    dbSetConv,
    dbSetAoN,
    dbSetSoH,
  )
  .filter((rawCard) => rawCard.type_code === 'plot')
  .map((rawCard) => {
    const card = {};

    card.affiliation = rawCard.affiliation_code;
    card.faction = rawCard.faction_code;
    card.formats = [];
    card.id = rawCard.code;
    card.name = rawCard.name;
    card.points = parseInt(rawCard.points, 10);
    card.restrictedFormats = [];
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

    formats.forEach((format) => {
      if (format.data.sets.includes(rawCard.set_code)) {
        card.formats.push(format.code);
      }

      if (format && format.data && format.data.restricted) {
        format.data.restricted.forEach((restrictedId) => {
          if (restrictedId === rawCard.code) {
            card.restrictedFormats.push(format.code);
          }
        });
      }
    });

    return card;
  });

plots = plots.sort((a, b) => {
  if (a.affiliation !== b.affiliation) {
    return affiliationOrder[a.affiliation] - affiliationOrder[b.affiliation];
  }

  if (a.faction !== b.faction) {
    return factionOrder[a.faction] - factionOrder[b.faction];
  }

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

plots = plots.map((card, index) => ({
  affiliation: card.affiliation,
  faction: card.faction,
  formats: card.formats,
  id: card.id,
  name: card.name,
  points: card.points,
  restrictedFormats: card.restrictedFormats,
  set: card.set,

  hasRestriction: [
    '08054', // PLOT: Retribution, 08054
    '08155', // PLOT: No Allegiance, 08155
    '08156', // PLOT: Solidarity, 08156
    '10016', // PLOT: Allies of Necessity, 10016
    '11119', // PLOT: Temporary Truce, 11119
  ].includes(card.id),
  hasModification: [
    '08155', // PLOT: No Allegiance, 08155
    '08156', // PLOT: Solidarity, 08156
    '11119', // PLOT: Temporary Truce, 11119
  ].includes(card.id),

  rank: index,
}));

const plotsObject = {};
plots.forEach((plot) => {
  plotsObject[plot.id] = plot;
});

plotsStats.count = plots.length || 0;

console.log(`Output ${plots.length} plots...`);
jsonfile.writeFile(path.join(__dirname, '../data/plots.json'), plotsObject);
jsonfile.writeFile(
  path.join(__dirname, '../data/plots_stats.json'),
  plotsStats,
);
jsonfile.writeFile(path.join(__dirname, '../data/plots_checksum.json'), {
  checksum: checksum(plots),
  stats_checksum: checksum(plotsStats),
});
