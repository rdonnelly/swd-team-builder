import SQLite from 'react-native-sqlite-storage';
import squel from 'squel';

import store from '../store/store';
import {
  getDeckCharacters,
  getDeckAffiliation,
  getExcludedCharacterIds,
} from '../store/selectors/deckSelectors';
import {
  getFilters,
} from '../store/selectors/teamSelectors';


class Database {
  constructor() {
    this.databaseLocation = '~www/swd-teams.db';
    this.databaseName = 'swd-teams';
    this.databaseReadOnly = true;
    this.database = null;

    this.sortOrder = [
      'diceCount', 'health', 'points',
    ];

    this.listeners = [];

    store.subscribe(this.storeChange);

    SQLite.DEBUG(false);
    SQLite.enablePromise(true);
  }

  getDatabase() {
    if (this.database !== null) {
      return Promise.resolve(this.database);
    }

    return this.open();
  }

  // Open the connection to the database
  open() {
    return SQLite.openDatabase({
      createFromLocation: this.databaseLocation,
      name: this.databaseName,
      readOnly: this.databaseReadOnly,
    })
      .then((db) => {
        console.log('[db] Database open!');
        this.database = db;
        return db;
      });
  }

  // Close the connection to the database
  close() {
    if (this.database === null) {
      return Promise.reject(new Error('[db] Database was not open; unable to close.'));
    }

    return this.database.close().then(() => {
      console.log('[db] Database closed.');
      this.database = null;
    });
  }

  addChangeListener = (callback) => {
    this.listeners.push(callback);
  }

  removeChangeListener = (listener) => {
    const listenerIndex = this.listeners.indexOf(listener);
    if (listenerIndex !== -1) {
      this.listeners.splice(listenerIndex, 1);
    }
  }

  storeChange = () => {
    this.listeners.forEach((listener) => listener());
  }

  updateSortPriority = (priority) => {
    const options = [...this.sortOrder];

    options.sort((a, b) => {
      if (a === priority) return -1;
      if (b === priority) return 1;
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    this.sortOrder = options;
  }

  getTeamsBaseQuery = () => {
    const query = squel
      .select()
      .from('teams');

    // match deck characters
    const deckCharacters = getDeckCharacters(store.getState());
    deckCharacters.forEach(({ id, diceCount, count }) => {
      if (count > 1) {
        query.where(`key LIKE "%${id}_1_${count}%"`);
      } else if (diceCount !== 0) {
        query.where(`key LIKE "%${id}_${diceCount}_1%"`);
      } else {
        query.where(`key LIKE "%${id}%"`);
      }
    });

    // match deck affiliation
    const deckAffiliation = getDeckAffiliation(store.getState());
    if (deckAffiliation === 'hero') {
      query.where('affiliationHero = 1');
    }
    if (deckAffiliation === 'villain') {
      query.where('affiliationVillain = 1');
    }

    // exclude characters
    const excludedCharacterIds = getExcludedCharacterIds(store.getState());
    excludedCharacterIds.forEach((id) => {
      query.where(`key NOT LIKE "%${id}%"`);
    });

    // filters
    const filters = getFilters(store.getState());
    console.log('FILTERS', filters);

    // character
    query.where('characterCount BETWEEN ? AND ?', filters.minCharacterCount, filters.maxCharacterCount);

    // dice
    query.where('diceCount BETWEEN ? AND ?', filters.minDice, filters.maxDice);

    // health
    query.where('health BETWEEN ? AND ?', filters.minHealth, filters.maxHealth);

    // points
    query.where('points BETWEEN ? AND ?', filters.minPoints, filters.maxPoints);

    // affiliations
    const affiliationsExpression = squel.expr();
    if (!filters.affiliations.villain) {
      affiliationsExpression.or('affiliationVillain = 0');
    }
    if (!filters.affiliations.hero) {
      affiliationsExpression.or('affiliationHero = 0');
    }
    if (!filters.affiliations.neutral) {
      affiliationsExpression.or('affiliationNeutral = 0');
    }
    query.where(affiliationsExpression);

    // damageTypes
    const damageTypesExpression = squel.expr();
    if (!filters.damageTypes.ID) {
      damageTypesExpression.and('damageIndirect = 0');
    }
    if (!filters.damageTypes.MD) {
      damageTypesExpression.and('damageMelee = 0');
    }
    if (!filters.damageTypes.ND) {
      damageTypesExpression.and('damageNone = 0');
    }
    if (!filters.damageTypes.RD) {
      damageTypesExpression.and('damageRanged = 0');
    }
    query.where(damageTypesExpression);

    // factions
    const factionsExpression = squel.expr();
    if (!filters.factions.blue) {
      factionsExpression.and('factionBlue = 0');
    }
    if (!filters.factions.gray) {
      factionsExpression.and('factionGray = 0');
    }
    if (!filters.factions.red) {
      factionsExpression.and('factionRed = 0');
    }
    if (!filters.factions.yellow) {
      factionsExpression.and('factionYellow = 0');
    }
    query.where(factionsExpression);

    // sets
    const setsExpression = squel.expr();
    Object.keys(filters.sets).forEach((code) => {
      if (!filters.sets[code]) {
        setsExpression.and(`sets NOT LIKE "%${code}%"`);
      }
    });
    query.where(setsExpression);


    // plot
    if (filters.plotPoints) {
      // plot faction
      const plotFactionsExpression = squel.expr();
      if (filters.plotFactions.blue) {
        plotFactionsExpression.and('factionBlue = 1');
      }
      if (filters.plotFactions.red) {
        plotFactionsExpression.and('factionRed = 1');
      }
      if (filters.plotFactions.yellow) {
        plotFactionsExpression.and('factionYellow = 1');
      }
      query.where(plotFactionsExpression);
    }

    // plot points
    query.where('points <= ?', 30 - filters.plotPoints);
    if (filters.plotPoints < 0) {
      query.where('points > ?', 30);
    }

    return query;
  }

  getTeam(key) {
    return this.getDatabase()
      .then((db) => db.executeSql(`
        SELECT
          key,
          diceCount,
          health,
          points,
          affiliationHero,
          affiliationNeutral,
          affiliationVillain
        FROM
          teams
        WHERE
          key = ?
        LIMIT 1
      ;`, [key]))
      .then(([results]) => {
        if (results === undefined) {
          return null;
        }

        return results.rows.item(0) || null;
      });
  }

  getTeams() {
    console.log('[db] Fetching teams from the db...');

    const query = this.getTeamsBaseQuery()
      .field('key')
      .field('diceCount')
      .field('health')
      .field('points')
      .limit(100);

    this.sortOrder.forEach((column) => {
      query.order(column, false);
    });

    return this.getDatabase()
      .then((db) => db.executeSql(query.toString()))
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }

        return results.rows.raw();

        // return results.rows.map((row) => {
        //   return {
        //     row
        //   }
        // });

        // const count = results.rows.length;
        // const lists = [];
        // for (let i = 0; i < count; i += 1) {
        //   const row = results.rows.item(i);
        //   const { title, id } = row;
        //   console.log(`[db] List title: ${title}, id: ${id}`);
        //   lists.push({ id, title });
        // }
        // return lists;
      });
  }

  getTeamsCount() {

    const query = this.getTeamsBaseQuery()
      .field('COUNT(*)', 'count');

    return this.getDatabase()
      .then((db) => db.executeSql(query.toString()))
      .then(([results]) => {
        if (results === undefined) {
          return null;
        }

        const row = results.rows.item(0) || null;

        if (!row) {
          return null;
        }

        return row.count;
      });
  }
}

const database = new Database();

export default database;
