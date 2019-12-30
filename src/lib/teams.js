import {
  affiliations as affiliationsList,
  factions as factionsList,
  damageTypes as damageTypesList,
  sets as setsList,
} from './Destiny';

export const filterTeamsByDeck = (
  teams,
  deckCharacters,
  deckAffiliation,
  excludedCharacterIds,
) => {
  if (deckCharacters.length === 0 && excludedCharacterIds.length === 0) {
    return teams;
  }

  let outputTeams = teams;

  deckCharacters.forEach((deckCharacterObject) => {
    const { diceCount } = deckCharacterObject;
    const characterKey = `${deckCharacterObject.id}_${diceCount}_${
      deckCharacterObject.count
    }`;
    const regularCharacterKey = `${deckCharacterObject.id}_1_${
      deckCharacterObject.count
    }`;
    const eliteCharacterKey = `${deckCharacterObject.id}_2_${
      deckCharacterObject.count
    }`;

    outputTeams = outputTeams.filter((team) => {
      if (
        deckAffiliation !== 'neutral' &&
        !team.affiliations.includes(deckAffiliation)
      ) {
        return false;
      }

      if (diceCount === 0) {
        return (
          team.key.includes(regularCharacterKey) ||
          team.key.includes(eliteCharacterKey)
        );
      }

      return team.key.includes(characterKey);
    });
  });

  excludedCharacterIds.forEach((excludedCharacterId) => {
    outputTeams = outputTeams.filter(
      (team) => !team.key.includes(excludedCharacterId),
    );
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

    // TODO check if plot makes sense for team
    //    for now, we will just hide < 31-point teams
    //    later, e.g. we should show 5 jawas that benefit from the +1 health plot
    if (plotPoints < 0 && team.points < 31) {
      return false;
    }

    if (team.points > 30 - plotPoints) {
      return false;
    }

    if (
      plotPoints !== 0 &&
      plotFactions[0] !== 'gray' &&
      !team.factions.includes(plotFactions[0])
    ) {
      return false;
    }

    if (!skipAffiliations) {
      if (
        affiliations.length === 0 ||
        !team.affiliations.every((val) => affiliations.includes(val))
      ) {
        return false;
      }
    }

    if (!skipDamageTypes) {
      if (
        damageTypes.length === 0 ||
        !team.damageTypes.every((val) => damageTypes.includes(val))
      ) {
        return false;
      }
    }

    if (!skipFactions) {
      if (
        factions.length === 0 ||
        !team.factions.every((val) => factions.includes(val))
      ) {
        return false;
      }
    }

    if (!skipSets) {
      if (sets.length === 0 || !team.sets.every((val) => sets.includes(val))) {
        return false;
      }
    }

    return true;
  });

  return outputTeams;
};

export const sortTeams = (teams, sortOrder) => {
  const sortedTeams = teams.slice(0);

  sortedTeams.sort((teamA, teamB) => {
    const sortKey = sortOrder[0];
    return teamA.ranks[sortKey] - teamB.ranks[sortKey];
  });

  return sortedTeams;
};
