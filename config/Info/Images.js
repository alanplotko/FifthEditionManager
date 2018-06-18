/**
 * Character race image assets
 */
const RACE_IMAGES = {
  /* eslint-disable global-require */
  dwarf: require('FifthEditionManager/assets/images/races/portrait_dwarf.png'),
  elf: require('FifthEditionManager/assets/images/races/portrait_elf.png'),
  halfling: require('FifthEditionManager/assets/images/races/portrait_halfling.png'),
  human: require('FifthEditionManager/assets/images/races/portrait_human.png'),
  dragonborn: require('FifthEditionManager/assets/images/races/portrait_dragonborn.png'),
  gnome: require('FifthEditionManager/assets/images/races/portrait_gnome.png'),
  half_elf: require('FifthEditionManager/assets/images/races/portrait_half_elf.png'),
  half_orc: require('FifthEditionManager/assets/images/races/portrait_half_orc.png'),
  tiefling: require('FifthEditionManager/assets/images/races/portrait_tiefling.png'),
  /* eslint-enable global-require */
};

/**
 * Character class image assets
 */
const BASE_CLASS_ICONS = {
  /* eslint-disable global-require */
  barbarian: require('FifthEditionManager/assets/images/classes/icons/class_barbarian.png'),
  bard: require('FifthEditionManager/assets/images/classes/icons/class_bard.png'),
  cleric: require('FifthEditionManager/assets/images/classes/icons/class_cleric.png'),
  druid: require('FifthEditionManager/assets/images/classes/icons/class_druid.png'),
  fighter: require('FifthEditionManager/assets/images/classes/icons/class_fighter.png'),
  monk: require('FifthEditionManager/assets/images/classes/icons/class_monk.png'),
  paladin: require('FifthEditionManager/assets/images/classes/icons/class_paladin.png'),
  ranger: require('FifthEditionManager/assets/images/classes/icons/class_ranger.png'),
  rogue: require('FifthEditionManager/assets/images/classes/icons/class_rogue.png'),
  sorcerer: require('FifthEditionManager/assets/images/classes/icons/class_sorcerer.png'),
  warlock: require('FifthEditionManager/assets/images/classes/icons/class_warlock.png'),
  wizard: require('FifthEditionManager/assets/images/classes/icons/class_wizard.png'),
  /* eslint-enable global-require */
};

const BASE_CLASS_BACKDROPS = {
  /* eslint-disable global-require */
  barbarian: require('FifthEditionManager/assets/images/classes/backdrops/class_barbarian.png'),
  bard: require('FifthEditionManager/assets/images/classes/backdrops/class_bard.png'),
  cleric: require('FifthEditionManager/assets/images/classes/backdrops/class_cleric.png'),
  druid: require('FifthEditionManager/assets/images/classes/backdrops/class_druid.png'),
  fighter: require('FifthEditionManager/assets/images/classes/backdrops/class_fighter.png'),
  monk: require('FifthEditionManager/assets/images/classes/backdrops/class_monk.png'),
  paladin: require('FifthEditionManager/assets/images/classes/backdrops/class_paladin.png'),
  ranger: require('FifthEditionManager/assets/images/classes/backdrops/class_ranger.png'),
  rogue: require('FifthEditionManager/assets/images/classes/backdrops/class_rogue.png'),
  sorcerer: require('FifthEditionManager/assets/images/classes/backdrops/class_sorcerer.png'),
  warlock: require('FifthEditionManager/assets/images/classes/backdrops/class_warlock.png'),
  wizard: require('FifthEditionManager/assets/images/classes/backdrops/class_wizard.png'),
  /* eslint-enable global-require */
};

export default {
  RACE: RACE_IMAGES,
  BASE_CLASS: {
    ICON: BASE_CLASS_ICONS,
    BACKDROP: BASE_CLASS_BACKDROPS,
  },
};
