export const RACES = [
  {
    name: 'Dwarf',
    description: 'These short and stocky defenders of mountain fortresses are often seen as stern and humorless; they\'re known for mining the earth\'s treasures and crafting magnificent items from ore and gemstones.',
    image: require('DNDManager/assets/images/races/portrait_dwarf.png'),
  },
  {
    name: 'Elf',
    description: 'Tall, noble, and often haughty, elves are long-lived and subtle masters of the wilderness, and excel in the arcane arts.',
    image: require('DNDManager/assets/images/races/portrait_elf.png'),
  },
  {
    name: 'Halfling',
    description: 'Members of this diminutive race find strength in family, community, and their own innate and seemingly inexhaustible luck.',
    image: require('DNDManager/assets/images/races/portrait_halfling.png'),
  },
  {
    name: 'Human',
    description: 'Ambitious, sometimes heroic, and always confident, humans have an ability to work together toward common goals that makes them a force to be reckoned with.',
    image: require('DNDManager/assets/images/races/portrait_human.png'),
  },
  {
    name: 'Dragonborn',
    description: 'Born to fight, dragonborn are a race of wandering mercenaries, soldiers, and adventurers.',
    image: require('DNDManager/assets/images/races/portrait_dragonborn.png'),
  },
  {
    name: 'Gnome',
    description: 'Gnomes are whimsical artisans and tinkers, creating strange devices powered by magic, alchemy, and their quirky imagination; they have an insatiable need for new experiences that often gets them in trouble.',
    image: require('DNDManager/assets/images/races/portrait_gnome.png'),
  },
  {
    name: 'Half-Elf',
    description: 'Often caught between the worlds of their progenitor races, half-elves are a race of both grace and contradiction.',
    image: require('DNDManager/assets/images/races/portrait_half_elf.png'),
  },
  {
    name: 'Half-Orc',
    description: 'Often fierce and savage, sometimes noble and resolute, half-orcs can manifest the best and worst qualities of their parent races.',
    image: require('DNDManager/assets/images/races/portrait_half_orc.png'),
  },
  {
    name: 'Tiefling',
    description: 'Tieflings, often descendants of fiends and humans, are known for their cunning, allure, and leadership.',
    image: require('DNDManager/assets/images/races/portrait_tiefling.png'),
  },
];

export const CLASSES = [
  {
    name: 'Barbarian',
    description: 'A fierce warrior of primitive background who can enter a battle rage.',
    hitDie: 'd12',
    primaryAbility: 'Strength',
    proficiencies: {
      savingThrow: 'Strength & Constitution',
      armorAndWeapon: 'Light and medium armor, shields, simple and martial weapons',
    },
    image: require('DNDManager/assets/images/classes/class_barbarian.png'),
  },
  {
    name: 'Bard',
    description: 'An inspiring magician whose power echoes the music of creation.',
    hitDie: 'd8',
    primaryAbility: 'Charisma',
    proficiencies: {
      savingThrow: 'Dexterity & Charisma',
      armorAndWeapon: 'Light armor, simple weapons, hand crossbows, longswords, rapiers, shortswords',
    },

    image: require('DNDManager/assets/images/classes/class_bard.png'),
  },
  {
    name: 'Cleric',
    description: 'A priestly champion who wields divine magic in service of a higher power.',
    hitDie: 'd8',
    primaryAbility: 'Wisdom',
    proficiencies: {
      savingThrow: 'Wisdom & Charisma',
      armorAndWeapon: 'Light and medium armor, shields, simple weapons',
    },
    image: require('DNDManager/assets/images/classes/class_cleric.png'),
  },
  {
    name: 'Druid',
    description: 'A priest of the Old Faith, wielding the powers of nature - moonlight and plant growth, fire and lightning - and adopting animal forms.',
    hitDie: 'd8',
    primaryAbility: 'Wisdom',
    proficiencies: {
      savingThrow: 'Intelligence & Wisdom',
      armorAndWeapon: 'Light and medium armor (nonmetal), shields (nonmetal), clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears',
    },
    image: require('DNDManager/assets/images/classes/class_druid.png'),
  },
  {
    name: 'Fighter',
    description: 'A master of martial combat, skilled with a variety of weapons and armor.',
    hitDie: 'd10',
    primaryAbility: 'Strength or Dexterity',
    proficiencies: {
      savingThrow: 'Strength & Constitution',
      armorAndWeapon: 'All armor, shields, simple and martial weapons',
    },
    image: require('DNDManager/assets/images/classes/class_fighter.png'),
  },
  {
    name: 'Monk',
    description: 'An master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
    hitDie: 'd8',
    primaryAbility: 'Dexterity & Wisdom',
    proficiencies: {
      savingThrow: 'Strength & Dexterity',
      armorAndWeapon: 'Simple weapons, shortswords',
    },
    image: require('DNDManager/assets/images/classes/class_monk.png'),
  },
  {
    name: 'Paladin',
    description: 'A holy warrior bound to a sacred oath.',
    hitDie: 'd10',
    primaryAbility: 'Strength & Charisma',
    proficiencies: {
      savingThrow: 'Wisdom & Charisma',
      armorAndWeapon: 'All armor, shields, simple and martial weapons',
    },
    image: require('DNDManager/assets/images/classes/class_paladin.png'),
  },
  {
    name: 'Ranger',
    description: 'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.',
    hitDie: 'd10',
    primaryAbility: 'Dexterity & Wisdom',
    proficiencies: {
      savingThrow: 'Strength & Dexterity',
      armorAndWeapon: 'Light and medium armor, shields, simple and martial weapons',
    },
    image: require('DNDManager/assets/images/classes/class_ranger.png'),
  },
  {
    name: 'Rogue',
    description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
    hitDie: 'd8',
    primaryAbility: 'Dexterity',
    proficiencies: {
      savingThrow: 'Dexterity & Intelligence',
      armorAndWeapon: 'Light armor, simple weapons, hand crossbows, longswords, rapiers, shortswords',
    },
    image: require('DNDManager/assets/images/classes/class_rogue.png'),
  },
  {
    name: 'Sorcerer',
    description: 'A spellcaster who draws on inherent magic from a gift or bloodline.',
    hitDie: 'd6',
    primaryAbility: 'Charisma',
    proficiencies: {
      savingThrow: 'Constitution & Charisma',
      armorAndWeapon: 'Daggers, darts, slings, quarterstaffs, light crossbows',
    },
    image: require('DNDManager/assets/images/classes/class_sorcerer.png'),
  },
  {
    name: 'Warlock',
    description: 'A wielder of magic that is derived from a bargain with an extraplanar entity.',
    hitDie: 'd8',
    primaryAbility: 'Charisma',
    proficiencies: {
      savingThrow: 'Wisdom & Charisma',
      armorAndWeapon: 'Light armor, simple weapons',
    },
    image: require('DNDManager/assets/images/classes/class_warlock.png'),
  },
  {
    name: 'Wizard',
    description: 'A scholarly magic-user capable of manipulating the structures of reality.',
    hitDie: 'd6',
    primaryAbility: 'Intelligence',
    proficiencies: {
      savingThrow: 'Intelligence & Wisdom',
      armorAndWeapon: 'Daggers, darts, slings, quarterstaffs, light crossbows',
    },
    image: require('DNDManager/assets/images/classes/class_wizard.png'),
  },
];
