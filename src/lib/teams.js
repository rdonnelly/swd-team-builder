export const filterTeams = (teams, deckCharacters, settings) => {
  let outputTeams = teams;

  outputTeams = outputTeams.filter((team) => {
    const minPoints = settings.get('minPoints');
    if (team.get('p') < minPoints) {
      return false;
    }

    const maxPoints = settings.get('maxPoints');
    if (team.get('p') > maxPoints) {
      return false;
    }

    const minDice = settings.get('minDice');
    if (team.get('nD') < minDice) {
      return false;
    }

    const maxDice = settings.get('maxDice');
    if (team.get('nD') > maxDice) {
      return false;
    }

    const minHealth = settings.get('minHealth');
    if (team.get('h') < minHealth) {
      return false;
    }

    const damageTypes = settings.get('damageTypes');
    if (!team.get('dT').isSubset(damageTypes)) {
      return false;
    }

    const sets = settings.get('sets');
    if (!team.get('s').isSubset(sets)) {
      return false;
    }

    return deckCharacters.every((deckCharacterObject) => {
      const numDice = deckCharacterObject.get('numDice');
      const characterKey = `${deckCharacterObject.get('id')}_${numDice}_${deckCharacterObject.get('count')}`;
      const regularCharacterKey = `${deckCharacterObject.get('id')}_1_${deckCharacterObject.get('count')}`;
      const eliteCharacterKey = `${deckCharacterObject.get('id')}_2_${deckCharacterObject.get('count')}`;

      if (deckCharacterObject.get('numDice') === 0) {
        return team.get('characterKeys').includes(regularCharacterKey) ||
          team.get('characterKeys').includes(eliteCharacterKey);
      }

      return team.get('characterKeys').includes(characterKey);
    });
  });

  if (teams.equals(outputTeams)) {
    return teams;
  }

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

export const filterAndSortTeams = (teams, deckCharacters, settings, sortOrder) =>
  sortTeams(filterTeams(teams, deckCharacters, settings), sortOrder);
