export const combTeams = (teams, deckCharacters, settings, sortOrder) => {
  let outputTeams = teams;

  // filter for cards in deck
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
      let deckCharacterObjectSubset = deckCharacterObject;
      if (deckCharacterObjectSubset.get('isElite') === null) {
        deckCharacterObjectSubset = deckCharacterObjectSubset.delete('isElite');
      }

      return team.get('characters').find(teamCharacterObject =>
        deckCharacterObjectSubset.isSubset(teamCharacterObject));
    });
  });

  // sort teams
  outputTeams = outputTeams.sort((a, b) => {
    let sortValue = b.get('characters').count() - a.get('characters').count();

    const sortValues = {
      points: b.get('points') - a.get('points'),
      dice: b.get('dice') - a.get('dice'),
      health: b.get('health') - a.get('health'),
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

  if (teams.equals(outputTeams)) {
    return teams;
  }

  return outputTeams;
};

export const filterTeamsByCharacters = (teamsToFilter, deckCards) =>
  teamsToFilter.filter(team =>
    deckCards.every((characterObject) => {
      const character = team.get('characters')
        .find((teamCharacter) => {
          if (teamCharacter.get('id') !== characterObject.get('id')) {
            return false;
          }

          if (characterObject.get('isElite') !== null &&
              teamCharacter.get('isElite') !== characterObject.get('isElite')) {
            return false;
          }

          return true;
        });

      return character !== undefined && character.get('count') >= characterObject.get('count');
    }),
  );

export const filterTeamsBySettings = (teamsToFilter, settings) =>
  teamsToFilter.filter((team) => {
    const minPoints = settings.get('minPoints');
    const maxPoints = settings.get('maxPoints');
    const minDice = settings.get('minDice');
    const maxDice = settings.get('maxDice');
    const minHealth = settings.get('minHealth');
    const showMixedDamage = settings.get('mixedDamage');
    const showSets = settings.get('showSets');

    if (team.get('points') < minPoints) {
      return false;
    }

    if (team.get('points') > maxPoints) {
      return false;
    }

    if (team.get('dice') < minDice) {
      return false;
    }

    if (team.get('dice') > maxDice) {
      return false;
    }

    if (team.get('health') < minHealth) {
      return false;
    }

    if (!showMixedDamage && team.get('damageTypes').count() > 1) {
      return false;
    }

    if (!team.get('sets').isSubset(showSets)) {
      return false;
    }

    return true;
  });

export const sortTeams = (teamsToSort, sortOrder) =>
  teamsToSort.sort((a, b) => {
    let sortValue = b.get('characters').count() - a.get('characters').count();

    const sortValues = {
      points: b.get('points') - a.get('points'),
      dice: b.get('dice') - a.get('dice'),
      health: b.get('health') - a.get('health'),
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
