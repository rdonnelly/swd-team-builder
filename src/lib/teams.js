import _intersection from 'lodash/intersection';
import {
  affiliations as affiliationsList,
  factions as factionsList,
  damageTypes as damageTypesList,
  sets as setsList,
} from '../lib/Destiny';

export const filterTeamsByDeck = (teams, deckCharacters, deckAffiliation, excludedCharacterIds) => {
  if (deckCharacters.length === 0 && excludedCharacterIds.length === 0) {
    return teams;
  }

  let outputTeams = teams;

  deckCharacters.forEach((deckCharacterObject) => {
    const numDice = deckCharacterObject.numDice;
    const characterKey = `${deckCharacterObject.id}_${numDice}_${deckCharacterObject.count}`;
    const regularCharacterKey = `${deckCharacterObject.id}_1_${deckCharacterObject.count}`;
    const eliteCharacterKey = `${deckCharacterObject.id}_2_${deckCharacterObject.count}`;

    outputTeams = outputTeams.filter((team) => {
      if (deckAffiliation !== 'neutral' && !team.a.includes(deckAffiliation)) {
        return false;
      }

      if (numDice === 0) {
        return team.cK.includes(regularCharacterKey) ||
          team.cK.includes(eliteCharacterKey);
      }

      return team.cK.includes(characterKey);
    });
  });

  excludedCharacterIds.forEach((excludedCharacterId) => {
    outputTeams = outputTeams.filter(team =>
      !team.cK.some(key => key.startsWith(`${excludedCharacterId}_`)),
    );
  });

  return outputTeams;
};

export const filterTeamsBySettings = (teams, settings) => {
  let outputTeams = teams;
  const minDice = settings.filters.minDice;
  const minHealth = settings.filters.minHealth;
  const minPoints = settings.filters.minPoints;
  const minCharacterCount = settings.filters.minCharacterCount;
  const maxCharacterCount = settings.filters.maxCharacterCount;
  const affiliations = settings.filters.affiliations;
  const factions = settings.filters.factions;
  const damageTypes = settings.filters.damageTypes;
  const sets = settings.filters.sets;

  let skipAffiliations = false;
  if (affiliations.length >= affiliationsList.length) {
    skipAffiliations = true;
  }

  let skipFactions = false;
  if (factions.length >= factionsList.length) {
    skipFactions = true;
  }

  let skipDamageTypes = false;
  if (damageTypes.length >= damageTypesList.length) {
    skipDamageTypes = true;
  }

  let skipSets = false;
  if (sets.length >= setsList.length) {
    skipSets = true;
  }

  outputTeams = outputTeams.filter((team) => {
    if (team.nD < minDice) {
      return false;
    }

    if (team.h < minHealth) {
      return false;
    }

    if (team.p < minPoints) {
      return false;
    }

    if (team.cC < minCharacterCount) {
      return false;
    }

    if (team.cC > maxCharacterCount) {
      return false;
    }

    if (!skipAffiliations) {
      if (affiliations.length === 0 ||
          (_intersection(team.a, affiliations).length !== team.a.length)) {
        return false;
      }
    }

    if (!skipDamageTypes) {
      if (damageTypes.length === 0 ||
          (_intersection(team.dT, damageTypes).length !== team.dT.length)) {
        return false;
      }
    }

    if (!skipFactions) {
      if (factions.length === 0 ||
          (_intersection(team.f, factions).length !== team.f.length)) {
        return false;
      }
    }

    if (!skipSets) {
      if (sets.length === 0 ||
          (_intersection(team.s, sets).length !== team.s.length)) {
        return false;
      }
    }

    return true;
  });

  return outputTeams;
};

export const sortTeams = (teams, sortOrder) =>
  teams.sort((a, b) => {
    const sortValues = {
      dice: a.get('rD') - b.get('rD'),
      health: a.get('rH') - b.get('rH'),
      points: a.get('rP') - b.get('rP'),
      characterCount: a.get('rC') - b.get('rC'),
    };

    let sortValue = 0;
    sortOrder.every((sortKey) => {
      if (sortValues[sortKey] !== 0) {
        sortValue = sortValues[sortKey];
        return false;
      }

      return true;
    });

    return sortValue;
  });
