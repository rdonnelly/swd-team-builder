import _has from 'lodash/has';

export const swdestiny = {
  RESOURCE: 'e900',
  SPECIAL: 'e901',
  BLANK: 'e902',
  DISCARD: 'e903',
  DISRUPT: 'e904',
  FOCUS: 'e905',
  MELEE: 'e906',
  RANGED: 'e907',
  SHIELD: 'e908',

  BATTLEFIELD: 'e947',
  CARDS: 'e90b',
  CHARACTER: 'e971',
  COLLECTORS: 'e90c',
  DIE: 'e90a',
  EVENT: 'e9b5',
  PLOT: 'e912',
  SUPPORT: 'e9b4',
  UNIQUE: 'e909',
  UPGRADE: 'e92e',

  AW: 'e90d',
  AWAKENINGS: 'e90d',
  SoR: 'e90e',
  SPIRIT_OF_REBELLION: 'e90e',
  TPG: 'e910',
  TWO_PLAYER_GAME: 'e910',
  EaW: 'e90f',
  EMPIRE_AT_WAR: 'e90f',
  LEG: 'e913',
  LEGACIES: 'e913',
  RIV: 'e914',
  RIVALS: 'e914',
};

export const validate = (font, key) => _has(font, key);
