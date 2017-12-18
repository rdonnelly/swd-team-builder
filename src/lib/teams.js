export const filterTeamsByDeck = (teams, deckCharacters) => {
  let outputTeams = teams;

  deckCharacters.forEach((deckCharacterObject) => {
    const numDice = deckCharacterObject.get('numDice');
    const characterKey = `${deckCharacterObject.get('id')}_${numDice}_${deckCharacterObject.get('count')}`;
    const regularCharacterKey = `${deckCharacterObject.get('id')}_1_${deckCharacterObject.get('count')}`;
    const eliteCharacterKey = `${deckCharacterObject.get('id')}_2_${deckCharacterObject.get('count')}`;

    outputTeams = outputTeams.filter((team) => {
      if (numDice === 0) {
        return team.get('cK').includes(regularCharacterKey) ||
          team.get('cK').includes(eliteCharacterKey);
      }

      return team.get('cK').includes(characterKey);
    });
  });

  return outputTeams;
};

export const filterTeamsBySettings = (teams, settings) => {
  let outputTeams = teams;

  outputTeams = outputTeams.filter((team) => {
    const minPoints = settings.getIn(['filters', 'minPoints']);
    if (team.get('p') < minPoints) {
      return false;
    }

    const maxPoints = settings.getIn(['filters', 'maxPoints']);
    if (team.get('p') > maxPoints) {
      return false;
    }

    const minDice = settings.getIn(['filters', 'minDice']);
    if (team.get('nD') < minDice) {
      return false;
    }

    const maxDice = settings.getIn(['filters', 'maxDice']);
    if (team.get('nD') > maxDice) {
      return false;
    }

    const minHealth = settings.getIn(['filters', 'minHealth']);
    if (team.get('h') < minHealth) {
      return false;
    }

    const damageTypes = settings.getIn(['filters', 'damageTypes']);
    if (!team.get('dT').isSubset(damageTypes)) {
      return false;
    }

    const sets = settings.getIn(['filters', 'sets']);
    if (!team.get('s').isSubset(sets)) {
      return false;
    }

    return true;
  });

  return outputTeams;
};

export const sortTeams = (teams, sortOrder) =>
  teams.sort((a, b) => {
    const sortValues = {
      dice: b.get('rD') - a.get('rD'),
      points: b.get('rP') - a.get('rP'),
      health: b.get('rH') - a.get('rH'),
      characterCount: b.get('rC') - a.get('rC'),
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
