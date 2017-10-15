export const filterTeams = (teams, deckCharacters, settings) => {
  let outputTeams = teams;

  outputTeams = outputTeams.filter((team) => {
    const minPoints = settings.get('minPoints');
    if (team.get('points') < minPoints) {
      return false;
    }

    const maxPoints = settings.get('maxPoints');
    if (team.get('points') > maxPoints) {
      return false;
    }

    const minDice = settings.get('minDice');
    if (team.get('dice') < minDice) {
      return false;
    }

    const maxDice = settings.get('maxDice');
    if (team.get('dice') > maxDice) {
      return false;
    }

    const minHealth = settings.get('minHealth');
    if (team.get('health') < minHealth) {
      return false;
    }

    const showMixedDamage = settings.get('mixedDamage');
    if (!showMixedDamage && team.get('damageTypes').count() > 1) {
      return false;
    }

    const showSets = settings.get('showSets');
    if (!team.get('sets').isSubset(showSets)) {
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
    let sortValue = b.get('characterKeys').count() - a.get('characterKeys').count();

    const sortValues = {
      dice: b.get('dice') - a.get('dice'),
      points: b.get('points') - a.get('points'),
      health: b.get('health') - a.get('health'),
      characterCount: b.get('characterCount') - a.get('characterCount'),
    };

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
