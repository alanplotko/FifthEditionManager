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

export const IMAGES = {
  RACE: RACE_IMAGES,
  BASE_CLASS: {
    ICON: BASE_CLASS_ICONS,
    BACKDROP: BASE_CLASS_BACKDROPS,
  }
};

export const ALIGNMENTS = [
  'Lawful Good', 'Lawful Neutral', 'Lawful Evil', 'Neutral Good', 'True Neutral', 'Neutral Evil',
  'Chaotic Good', 'Chaotic Neutral', 'Chaotic Evil',
];

export const EXPERIENCE = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

export const ABILITIES = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
];

export const RACES = [
  {
    key: 'dwarf',
    name: 'Dwarf',
    description: 'These short and stocky defenders of mountain fortresses are often seen as stern and humorless; they\'re known for mining the earth\'s treasures and crafting magnificent items from ore and gemstones.',
    speed: 25,
    age: { adulthood: 50, lifespan: 350 },
    alignment: ['lawful', 'good'],
    height: {
      base: 44,
      modifier: [2, 4], // 2d4
    },
    weight: {
      base: 115,
      modifier: [2, 6], // 2d6
    },
    languages: ['common', 'dwarvish'],
    additionalLanguages: 0,
    image: IMAGES.RACE.dwarf,
    modifiers: {
      constitution: 2,
    },
  },
  {
    key: 'elf',
    name: 'Elf',
    description: 'Tall, noble, and often haughty, elves are long-lived and subtle masters of the wilderness, and excel in the arcane arts.',
    speed: 30,
    age: { adulthood: 100, lifespan: 750 },
    alignment: ['chaotic', 'good'],
    height: {
      base: 54,
      modifier: [2, 10], // 2d10
    },
    weight: {
      base: 90,
      modifier: [1, 4], // 1d4
    },
    languages: ['common', 'elvish'],
    additionalLanguages: 0,
    image: IMAGES.RACE.elf,
    modifiers: {
      dexterity: 2,
    },
  },
  {
    key: 'halfling',
    name: 'Halfling',
    description: 'Members of this diminutive race find strength in family, community, and their own innate and seemingly inexhaustible luck.',
    speed: 25,
    age: { adulthood: 20, lifespan: 250 },
    alignment: ['lawful', 'good'],
    height: {
      base: 31,
      modifier: [2, 4], // 2d4
    },
    weight: {
      base: 35,
      modifier: [1, 1], // 1
    },
    languages: ['common', 'halfling'],
    additionalLanguages: 0,
    image: IMAGES.RACE.halfling,
    modifiers: {
      dexterity: 2,
    },
  },
  {
    key: 'human',
    name: 'Human',
    description: 'Ambitious, sometimes heroic, and always confident, humans have an ability to work together toward common goals that makes them a force to be reckoned with.',
    speed: 30,
    age: { adulthood: 18, lifespan: 100 },
    alignment: ['lawful', 'good'],
    height: {
      base: 56,
      modifier: [2, 10], // 2d10
    },
    weight: {
      base: 110,
      modifier: [2, 4], // 2d4
    },
    languages: ['common'],
    additionalLanguages: 1,
    image: IMAGES.RACE.human,
    modifiers: {
      strength: 1,
      dexterity: 1,
      constitution: 1,
      intelligence: 1,
      wisdom: 1,
      charisma: 1,
    },
  },
  {
    key: 'dragonborn',
    name: 'Dragonborn',
    description: 'Born to fight, dragonborn are a race of wandering mercenaries, soldiers, and adventurers.',
    speed: 30,
    age: { adulthood: 15, lifespan: 80 },
    alignment: ['good'],
    height: {
      base: 66,
      modifier: [2, 8], // 2d8
    },
    weight: {
      base: 175,
      modifier: [2, 6], // 2d6
    },
    languages: ['common', 'draconic'],
    additionalLanguages: 0,
    image: IMAGES.RACE.dragonborn,
    modifiers: {
      strength: 2,
      charisma: 1,
    },
  },
  {
    key: 'gnome',
    name: 'Gnome',
    description: 'Gnomes are whimsical artisans and tinkers, creating strange devices powered by magic, alchemy, and their quirky imagination; they have an insatiable need for new experiences that often gets them in trouble.',
    speed: 25,
    age: { adulthood: 40, lifespan: 500 },
    alignment: ['good'],
    height: {
      base: 35,
      modifier: [2, 4], // 2d4
    },
    weight: {
      base: 35,
      modifier: [1, 1], // 1
    },
    languages: ['common', 'gnomish'],
    additionalLanguages: 0,
    image: IMAGES.RACE.gnome,
    modifiers: {
      intelligence: 2,
    },
  },
  {
    key: 'half_elf',
    name: 'Half-Elf',
    description: 'Often caught between the worlds of their progenitor races, half-elves are a race of both grace and contradiction.',
    speed: 30,
    age: { adulthood: 20, lifespan: 180 },
    alignment: ['good'],
    height: {
      base: 57,
      modifier: [2, 8], // 2d8
    },
    weight: {
      base: 110,
      modifier: [2, 4], // 2d4
    },
    languages: ['common', 'elvish'],
    additionalLanguages: 1,
    image: IMAGES.RACE.half_elf,
    modifiers: {
      charisma: 2,
      extra: 2, // Extra 2 points to apply (+1 max to a single ability)
    },
  },
  {
    key: 'half_orc',
    name: 'Half-Orc',
    description: 'Often fierce and savage, sometimes noble and resolute, half-orcs can manifest the best and worst qualities of their parent races.',
    speed: 30,
    age: { adulthood: 14, lifespan: 75 },
    alignment: ['chaotic', 'evil'],
    height: {
      base: 58,
      modifier: [2, 10], // 2d10
    },
    weight: {
      base: 140,
      modifier: [2, 6], // 2d6
    },
    languages: ['common', 'orc'],
    additionalLanguages: 0,
    image: IMAGES.RACE.half_orc,
    modifiers: {
      strength: 2,
      constitution: 1,
    },
  },
  {
    key: 'tiefling',
    name: 'Tiefling',
    description: 'Tieflings, often descendants of fiends and humans, are known for their cunning, allure, and leadership.',
    speed: 30,
    age: { adulthood: 18, lifespan: 100 },
    alignment: ['chaotic', 'evil'],
    height: {
      base: 57,
      modifier: [2, 8], // 2d8
    },
    weight: {
      base: 110,
      modifier: [2, 4], // 2d4
    },
    languages: ['common', 'infernal'],
    additionalLanguages: 0,
    image: IMAGES.RACE.tiefling,
    modifiers: {
      intelligence: 1,
      charisma: 2,
    },
  },
];

export const CLASSES = [
  {
    key: 'barbarian',
    name: 'Barbarian',
    description: 'A relentless combatant, fueled by fury and in tune with the natural order.',
    hitDie: 12,
    proficiencies: {
      savingThrows: ['strength', 'constitution'],
      armor: ['light armor', 'medium armor', 'shields'],
      weapons: ['simple weapons', 'martial weapons'],
      tools: [],
      skills: {
        options: ['animal handling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.barbarian,
  },
  {
    key: 'bard',
    name: 'Bard',
    description: 'A story teller or musician using their wits, magic, and lore to get out of or avoid tight situations.',
    hitDie: 8,
    proficiencies: {
      savingThrows: ['dexterity', 'charisma'],
      armor: ['light armor'],
      weapons: ['simple weapons', 'hand crossbows', 'longswords', 'rapiers', 'shortswords'],
      tools: [{ tag: 'musical instruments', quantity: 3 }],
      skills: {
        quantity: 3,
      },
    },

    image: IMAGES.BASE_CLASS.ICON.bard,
  },
  {
    key: 'cleric',
    name: 'Cleric',
    description: 'A devotee of a deity. They are capable of supporting a party, healing their wounds or laying low their enemies with divine wrath.',
    hitDie: 8,
    proficiencies: {
      savingThrows: ['wisdom', 'charisma'],
      armor: ['light armor', 'medium armor', 'shields'],
      weapons: ['simple weapons'],
      tools: [],
      skills: {
        options: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.cleric,
  },
  {
    key: 'druid',
    name: 'Druid',
    description: 'A nomad devoted to the world and powers of nature, taking the form of a beast for battle or utility. They can support a party by healing their wounds or laying low their enemies with nature\'s wrath.',
    hitDie: 8,
    proficiencies: {
      savingThrows: ['intelligence', 'wisdom'],
      armor: ['light nonmetal armor', 'medium nonmetal armor', 'nonmetal shields'],
      weapons: ['clubs', 'daggers', 'darts', 'javelins', 'maces', 'quarterstaffs', 'scimitars', 'sickles', 'slings', 'spears'],
      tools: [{ name: 'herbalism kit' }],
      skills: {
        options: ['arcana', 'animal handling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.druid,
  },
  {
    key: 'fighter',
    name: 'Fighter',
    description: 'A skilled combatant or strategist typically relying on their heavy armor and weapons to cut down their enemies. Their training gives them unique abilities.',
    hitDie: 10,
    proficiencies: {
      savingThrows: ['strength', 'constitution'],
      armor: ['all armor', 'shields'],
      weapons: ['simple weapons', 'martial weapons'],
      tools: [],
      skills: {
        options: ['acrobatics', 'animal handling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.fighter,
  },
  {
    key: 'monk',
    name: 'Monk',
    description: 'A martial artist relying on the power of their own body to produce impressive results.',
    hitDie: 8,
    proficiencies: {
      savingThrows: ['strength', 'dexterity'],
      armor: [],
      weapons: ['simple weapons', 'shortswords'],
      tools: [{
        options: [
          { tag: 'artisan\'s tools', quantity: 1 },
          { tag: 'musical instruments', quantity: 1 },
        ],
      }],
      skills: {
        options: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.monk,
  },
  {
    key: 'paladin',
    name: 'Paladin',
    description: 'A skilled combatant who holds an oath with a God. They support their efforts with divine magic. Through their devotion, they gain special boons from their God.',
    hitDie: 10,
    proficiencies: {
      savingThrows: ['wisdom', 'charisma'],
      armor: ['all armor', 'shields'],
      weapons: ['simple weapons', 'martial weapons'],
      tools: [],
      skills: {
        options: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.paladin,
  },
  {
    key: 'ranger',
    name: 'Ranger',
    description: 'A deadly hunter who uses a unique blend of wilderness knowledge and martial ability.',
    hitDie: 10,
    proficiencies: {
      savingThrows: ['strength', 'dexterity'],
      armor: ['light armor', 'medium armor', 'shields'],
      weapons: ['simple weapons', 'martial weapons'],
      tools: [],
      skills: {
        options: ['animal handling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
        quantity: 3,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.ranger,
  },
  {
    key: 'rogue',
    name: 'Rogue',
    description: 'A thief or assassin with a knack for picking out and exploiting weaknesses. They stealthily move about, using trickery to get their way.',
    hitDie: 8,
    proficiencies: {
      savingThrows: ['dexterity', 'intelligence'],
      armor: ['light armor'],
      weapons: ['simple weapons', 'hand crossbows', 'longswords', 'rapiers', 'shortswords'],
      tools: [{ name: 'thieves\' tools' }],
      skills: {
        options: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleight of hand', 'stealth'],
        quantity: 4,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.rogue,
  },
  {
    key: 'sorcerer',
    name: 'Sorcerer',
    description: 'A user of magic who draws power from within, summoning their innate magical power and bending it to their will.',
    hitDie: 6,
    proficiencies: {
      savingThrows: ['constitution', 'charisma'],
      armor: [],
      weapons: ['daggers', 'darts', 'slings', 'quarterstaffs', 'light crossbows'],
      tools: [],
      skills: {
        options: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.sorcerer,
  },
  {
    key: 'warlock',
    name: 'Warlock',
    description: 'A user of magic who holds a pact with a powerful entity, trading favors for power.',
    hitDie: 8,
    proficiencies: {
      savingThrows: ['wisdom', 'charisma'],
      armor: ['light armor'],
      weapons: ['simple weapons'],
      tools: [],
      skills: {
        options: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.warlock,
  },
  {
    key: 'wizard',
    name: 'Wizard',
    description: 'A keeper of arcane secrets and forgotten knowledge who manipulates magic and spells with cunning.',
    hitDie: 6,
    proficiencies: {
      savingThrows: ['intelligence', 'wisdom'],
      armor: [],
      weapons: ['daggers', 'darts', 'slings', 'quarterstaffs', 'light crossbows'],
      tools: [],
      skills: {
        options: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.wizard,
  },
];

export const BACKGROUNDS = [
  {
    key: 'acolyte',
    name: 'Acolyte',
    description: 'You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, perform ing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine.',
    equipment: 'A holy symbol (a gift to you when you entered the priesthood), a prayer book or prayer wheel, 5 sticks of incense, vestments, a set of common clothes, and a pouch containing 15gp.',
    additionalLanguages: 2,
    proficiencies: {
      skills: ['insight', 'religion'],
      tools: [],
    },
  },
];

export const BASE_SKILLS = {
  acrobatics: {
    skillLabel: 'Acrobatics',
    modifier: 0,
    ability: 'dexterity',
    proficient: false,
  },
  animalHandling: {
    skillLabel: 'Animal Handling',
    modifier: 0,
    ability: 'wisdom',
    proficient: false,
  },
  arcana: {
    skillLabel: 'Arcana',
    modifier: 0,
    ability: 'intelligence',
    proficient: false,
  },
  athletics: {
    skillLabel: 'Athletics',
    modifier: 0,
    ability: 'strength',
    proficient: false,
  },
  deception: {
    skillLabel: 'Deception',
    modifier: 0,
    ability: 'charisma',
    proficient: false,
  },
  history: {
    skillLabel: 'History',
    modifier: 0,
    ability: 'intelligence',
    proficient: false,
  },
  insight: {
    skillLabel: 'Insight',
    modifier: 0,
    ability: 'wisdom',
    proficient: false,
  },
  intimidation: {
    skillLabel: 'Intimidation',
    modifier: 0,
    ability: 'charisma',
    proficient: false,
  },
  investigation: {
    skillLabel: 'Investigation',
    modifier: 0,
    ability: 'intelligence',
    proficient: false,
  },
  medicine: {
    skillLabel: 'Medicine',
    modifier: 0,
    ability: 'wisdom',
    proficient: false,
  },
  nature: {
    skillLabel: 'Nature',
    modifier: 0,
    ability: 'intelligence',
    proficient: false,
  },
  perception: {
    skillLabel: 'Perception',
    modifier: 0,
    ability: 'wisdom',
    proficient: false,
  },
  performance: {
    skillLabel: 'Performance',
    modifier: 0,
    ability: 'charisma',
    proficient: false,
  },
  persuasion: {
    skillLabel: 'Persuasion',
    modifier: 0,
    ability: 'charisma',
    proficient: false,
  },
  religion: {
    skillLabel: 'Religion',
    modifier: 0,
    ability: 'intelligence',
    proficient: false,
  },
  sleightOfHand: {
    skillLabel: 'Sleight of Hand',
    modifier: 0,
    ability: 'dexterity',
    proficient: false,
  },
  stealth: {
    skillLabel: 'Stealth',
    modifier: 0,
    ability: 'dexterity',
    proficient: false,
  },
  survival: {
    skillLabel: 'Survival',
    modifier: 0,
    ability: 'wisdom',
    proficient: false,
  },
};

export const LANGUAGES = {
  standard: [
    { language: 'common', speakers: ['humans'], script: 'common' },
    { language: 'dwarvish', speakers: ['dwarves'], script: 'dwarvish' },
    { language: 'elvish', speakers: ['elves'], script: 'elvish' },
    { language: 'giant', speakers: ['ogres', 'giants'], script: 'dwarvish' },
    { language: 'gnomish', speakers: ['gnomes'], script: 'dwarvish' },
    { language: 'goblin', speakers: ['goblinoids'], script: 'dwarvish' },
    { language: 'halfling', speakers: ['halflings'], script: 'common' },
    { language: 'orc', speakers: ['orcs'], script: 'dwarvish' },
  ],
  exotic: [
    { language: 'abyssal', speakers: ['demons'], script: 'common' },
    { language: 'celestial', speakers: ['celestials'], script: 'dwarvish' },
    { language: 'draconic', speakers: ['dragons', 'dragonborn'], script: 'elvish' },
    { language: 'deep speech', speakers: ['mind flayers', 'beholders'], script: 'none' },
    { language: 'infernal', speakers: ['devils'], script: 'infernal' },
    { language: 'primordial', speakers: ['elementals'], script: 'dwarvish' },
    { language: 'sylvan', speakers: ['fey creatures'], script: 'elvish' },
    { language: 'undercommon', speakers: ['underdark traders'], script: 'elvish' },
  ],
};
