import _intersection from 'lodash/intersection';
import {
  affiliations as affiliationsList,
  factions as factionsList,
  damageTypes as damageTypesList,
  sets as setsList,
} from './Destiny';

export const filterTeamsByDeck = (teams, deckCharacters, deckAffiliation, excludedCharacterIds) => {
  if (deckCharacters.length === 0 && excludedCharacterIds.length === 0) {
    return teams;
  }

  let outputTeams = teams;

  deckCharacters.forEach((deckCharacterObject) => {
    const { numDice } = deckCharacterObject;
    const characterKey = `${deckCharacterObject.id}_${numDice}_${deckCharacterObject.count}`;
    const regularCharacterKey = `${deckCharacterObject.id}_1_${deckCharacterObject.count}`;
    const eliteCharacterKey = `${deckCharacterObject.id}_2_${deckCharacterObject.count}`;

    outputTeams = outputTeams.filter((team) => {
      if (deckAffiliation !== 'neutral' && !team.affiliations.includes(deckAffiliation)) {
        return false;
      }

      if (numDice === 0) {
        return team.key.includes(regularCharacterKey) ||
          team.key.includes(eliteCharacterKey);
      }

      return team.key.includes(characterKey);
    });
  });

  excludedCharacterIds.forEach((excludedCharacterId) => {
    outputTeams = outputTeams.filter(team => !team.key.includes(excludedCharacterId));
  });

  return outputTeams;
};

export const filterTeamsBySettings = (teams, settings) => {
  let outputTeams = teams;
  const {
    maxCharacterCount,
    minCharacterCount,
    minDice,
    minHealth,
    minPoints,
    plotPoints,
    plotFactions,
    affiliations,
    factions,
    damageTypes,
    sets,
  } = settings.filters;

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
    if (team.diceCount < minDice) {
      return false;
    }

    if (team.health < minHealth) {
      return false;
    }

    if (team.points < minPoints) {
      return false;
    }

    if (team.characterCount < minCharacterCount) {
      return false;
    }

    if (team.characterCount > maxCharacterCount) {
      return false;
    }

    if (team.points > 30 - plotPoints) {
      return false;
    }

    if (plotPoints > 0 &&
        plotFactions[0] !== 'gray' &&
        !team.factions.includes(plotFactions[0])) {
      return false;
    }

    if (!skipAffiliations) {
      if (affiliations.length === 0 ||
          (_intersection(team.affiliations, affiliations).length !== team.affiliations.length)) {
        return false;
      }
    }

    if (!skipDamageTypes) {
      if (damageTypes.length === 0 ||
          (_intersection(team.damageTypes, damageTypes).length !== team.damageTypes.length)) {
        return false;
      }
    }

    if (!skipFactions) {
      if (factions.length === 0 ||
          (_intersection(team.factions, factions).length !== team.factions.length)) {
        return false;
      }
    }

    if (!skipSets) {
      if (sets.length === 0 ||
          (_intersection(team.sets, sets).length !== team.sets.length)) {
        return false;
      }
    }

    return true;
  });

  return outputTeams;
};

export const sortTeams = (teams, sortOrder) => {
  const sortedTeams = teams.slice(0);

  sortedTeams.sort((a, b) => {
    const sortValues = {
      dice: a.ranks.diceCount - b.ranks.diceCount,
      health: a.ranks.health - b.ranks.health,
      points: a.ranks.points - b.ranks.points,
      characterCount: a.ranks.characterCount - b.ranks.characterCount,
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

  return sortedTeams;
};
