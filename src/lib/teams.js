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
      if (deckAffiliation !== 'neutral' && !team.get('a').includes(deckAffiliation)) {
        return false;
      }

      if (numDice === 0) {
        return team.get('cK').includes(regularCharacterKey) ||
          team.get('cK').includes(eliteCharacterKey);
      }

      return team.get('cK').includes(characterKey);
    });
  });

  excludedCharacterIds.forEach((excludedCharacterId) => {
    outputTeams = outputTeams.filter(team =>
      !team.get('cK').some(key => key.startsWith(`${excludedCharacterId}_`)),
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
    if (team.get('nD') < minDice) {
      return false;
    }

    if (team.get('h') < minHealth) {
      return false;
    }

    if (team.get('p') < minPoints) {
      return false;
    }

    if (team.get('cC') < minCharacterCount) {
      return false;
    }

    if (team.get('cC') > maxCharacterCount) {
      return false;
    }

    const teamAffiliations = team.get('a').toJS();
    if (!skipAffiliations) {
      if (affiliations.length === 0 ||
          (_intersection(teamAffiliations, affiliations).length !== teamAffiliations.length)) {
        return false;
      }
    }

    const teamDamageTypes = team.get('dT').toJS();
    if (!skipDamageTypes) {
      if (damageTypes.length === 0 ||
          (_intersection(teamDamageTypes, damageTypes).length !== teamDamageTypes.length)) {
        return false;
      }
    }

    const teamFactions = team.get('f').toJS();
    if (!skipFactions) {
      if (factions.length === 0 ||
          (_intersection(teamFactions, factions).length !== teamFactions.length)) {
        return false;
      }
    }

    const teamSets = team.get('s').toJS();
    if (!skipSets) {
      if (sets.length === 0 ||
          (_intersection(teamSets, sets).length !== teamSets.length)) {
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
