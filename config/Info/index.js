/**
 * Character race image assets
 */
const RACE_IMAGES = {
  dwarf: require('DNDManager/assets/images/races/portrait_dwarf.png'),
  elf: require('DNDManager/assets/images/races/portrait_elf.png'),
  halfling: require('DNDManager/assets/images/races/portrait_halfling.png'),
  human: require('DNDManager/assets/images/races/portrait_human.png'),
  dragonborn: require('DNDManager/assets/images/races/portrait_dragonborn.png'),
  gnome: require('DNDManager/assets/images/races/portrait_gnome.png'),
  half_elf: require('DNDManager/assets/images/races/portrait_half_elf.png'),
  half_orc: require('DNDManager/assets/images/races/portrait_half_orc.png'),
  tiefling: require('DNDManager/assets/images/races/portrait_tiefling.png'),
};

/**
 * Character class image assets
 */
const BASE_CLASS_IMAGES = {
  barbarian: require('DNDManager/assets/images/classes/class_barbarian.png'),
  bard: require('DNDManager/assets/images/classes/class_bard.png'),
  cleric: require('DNDManager/assets/images/classes/class_cleric.png'),
  druid: require('DNDManager/assets/images/classes/class_druid.png'),
  fighter: require('DNDManager/assets/images/classes/class_fighter.png'),
  monk: require('DNDManager/assets/images/classes/class_monk.png'),
  paladin: require('DNDManager/assets/images/classes/class_paladin.png'),
  ranger: require('DNDManager/assets/images/classes/class_ranger.png'),
  rogue: require('DNDManager/assets/images/classes/class_rogue.png'),
  sorcerer: require('DNDManager/assets/images/classes/class_sorcerer.png'),
  warlock: require('DNDManager/assets/images/classes/class_warlock.png'),
  wizard: require('DNDManager/assets/images/classes/class_wizard.png'),
};

export const IMAGES = { RACE: RACE_IMAGES, BASE_CLASS: BASE_CLASS_IMAGES };

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
    description: 'A fierce warrior of primitive background who can enter a battle rage.',
    hitDie: 12,
    primaryAbility: { isAllPrimary: true, abilities: ['strength'] },
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
    image: IMAGES.BASE_CLASS.barbarian,
  },
  {
    key: 'bard',
    name: 'Bard',
    description: 'An inspiring magician whose power echoes the music of creation.',
    hitDie: 8,
    primaryAbility: { isAllPrimary: true, abilities: ['charisma'] },
    proficiencies: {
      savingThrows: ['dexterity', 'charisma'],
      armor: ['light armor'],
      weapons: ['simple weapons', 'hand crossbows', 'longswords', 'rapiers', 'shortswords'],
      tools: [{ tag: 'musical instruments', quantity: 3 }],
      skills: {
        quantity: 3,
      },
    },

    image: IMAGES.BASE_CLASS.bard,
  },
  {
    key: 'cleric',
    name: 'Cleric',
    description: 'A priestly champion who wields divine magic in service of a higher power.',
    hitDie: 8,
    primaryAbility: { isAllPrimary: true, abilities: ['wisdom'] },
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
    image: IMAGES.BASE_CLASS.cleric,
  },
  {
    key: 'druid',
    name: 'Druid',
    description: 'A priest of the Old Faith, wielding the powers of nature - moonlight and plant growth, fire and lightning - and adopting animal forms.',
    hitDie: 8,
    primaryAbility: { isAllPrimary: true, abilities: ['wisdom'] },
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
    image: IMAGES.BASE_CLASS.druid,
  },
  {
    key: 'fighter',
    name: 'Fighter',
    description: 'A master of martial combat, skilled with a variety of weapons and armor.',
    hitDie: 10,
    primaryAbility: { isAllPrimary: false, abilities: ['strength', 'dexterity'] },
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
    image: IMAGES.BASE_CLASS.fighter,
  },
  {
    key: 'monk',
    name: 'Monk',
    description: 'An master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
    hitDie: 8,
    primaryAbility: { isAllPrimary: true, abilities: ['dexterity', 'wisdom'] },
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
    image: IMAGES.BASE_CLASS.monk,
  },
  {
    key: 'paladin',
    name: 'Paladin',
    description: 'A holy warrior bound to a sacred oath.',
    hitDie: 10,
    primaryAbility: { isAllPrimary: true, abilities: ['strength', 'charisma'] },
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
    image: IMAGES.BASE_CLASS.paladin,
  },
  {
    key: 'ranger',
    name: 'Ranger',
    description: 'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.',
    hitDie: 10,
    primaryAbility: { isAllPrimary: true, abilities: ['dexterity', 'wisdom'] },
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
    image: IMAGES.BASE_CLASS.ranger,
  },
  {
    key: 'rogue',
    name: 'Rogue',
    description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
    hitDie: 8,
    primaryAbility: { isAllPrimary: true, abilities: ['dexterity'] },
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
    image: IMAGES.BASE_CLASS.rogue,
  },
  {
    key: 'sorcerer',
    name: 'Sorcerer',
    description: 'A spellcaster who draws on inherent magic from a gift or bloodline.',
    hitDie: 6,
    primaryAbility: { isAllPrimary: true, abilities: ['charisma'] },
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
    image: IMAGES.BASE_CLASS.sorcerer,
  },
  {
    key: 'warlock',
    name: 'Warlock',
    description: 'A wielder of magic that is derived from a bargain with an extraplanar entity.',
    hitDie: 8,
    primaryAbility: { isAllPrimary: true, abilities: ['charisma'] },
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
    image: IMAGES.BASE_CLASS.warlock,
  },
  {
    key: 'wizard',
    name: 'Wizard',
    description: 'A scholarly magic-user capable of manipulating the structures of reality.',
    hitDie: 6,
    primaryAbility: { isAllPrimary: true, abilities: ['intelligence'] },
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
    image: IMAGES.BASE_CLASS.wizard,
  },
];

export const BACKGROUNDS = [
  {
    key: 'acolyte',
    name: 'Acolyte',
    description: 'You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, perform ing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine.',
    equipment: 'A holy symbol, a prayer book or prayer wheel, 5 sticks of incense, vestments, a set of common clothes, and a beth pouch containing 15gp.',
    additionalLanguages: 2,
    proficiencies: {
      skills: ['insight', 'religion'],
      tools: [],
    },
  },
  {
    key: 'charlatan',
    name: 'Charlatan',
    description: 'You have always had a way with people. You know what makes them tick, you can tease out their hearts\' desires after a few minutes of conversation, and with a few leading questions you can read them like they were children\'s books. It’s a useful talent, and one that you’re perfectly willing to use for your advantage.',
    equipment: 'A set of fine clothes, a disguise kit, tools of the con of your choice (ten stoppered bottles filled with colored liquid, a set of weighted dice, a deck of marked cards, or a signet ring of an imaginary duke), and a belt pouch containing 15gp.',
    additionalLanguages: 0,
    proficiencies: {
      skills: ['deception', 'sleight of hand'],
      tools: [
        { name: 'disguise kit' },
        { name: 'forgery kit' },
      ],
    },
  },
  {
    key: 'criminal',
    name: 'Criminal',
    description: 'You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld.',
    equipment: 'A crowbar, a set of dark common clothes including a hood, and a belt pouch containing 15gp.',
    additionalLanguages: 0,
    proficiencies: {
      skills: ['deception', 'stealth'],
      tools: [
        { tag: 'gaming set', quantity: 1 },
        { name: 'thieves\' tools' },
      ],
    },
  },
  {
    key: 'entertainer',
    name: 'Entertainer',
    description: 'You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them. Your poetics can stir the hearts of those who hear you, awakening grief or joy, laughter or anger.',
    equipment: 'A musical instrument of your choice, the favor of an admirer (love letter, lock of hair, or trinket), a costume, and a belt pouch containing 15gp.',
    additionalLanguages: 0,
    proficiencies: {
      skills: ['acrobatics', 'performance'],
      tools: [
        { name: 'disguise kit' },
        { tag: 'musical instruments', quantity: 1 },
      ],
    },
  },
  {
    key: 'folk_hero',
    name: 'Folk Hero',
    description: 'You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere.',
    equipment: 'A set of artisan\'s tools of your choice, a shovel, an iron pot, a set of common clothes, and a belt pouch containing 10gp.',
    additionalLanguages: 0,
    proficiencies: {
      skills: ['animal handling', 'survival'],
      tools: [
        { tag: 'artisan\'s tools', quantity: 1 },
        { name: 'land vehicles' },
      ],
    },
  },
  {
    key: 'guild_artisan',
    name: 'Guild Artisan',
    description: 'You are a member of an artisan’s guild, skilled in a particular field and closely associated with other artisans. You are a well-established part of the mercantile world, freed by talent and wealth from the constraints of a feudal social order.',
    equipment: 'A set of artisan\'s tools of your choice, a letter of introduction from your guild, a set of traveler\'s clothes, and a belt pouch containing 15gp.',
    additionalLanguages: 1,
    proficiencies: {
      skills: ['insight', 'persuasion'],
      tools: [{ tag: 'artisan\'s tools', quantity: 1 }],
    },
  },
  {
    key: 'hermit',
    name: 'Hermit',
    description: 'You lived in seclusion - either in a sheltered community such as a monastery, or entirely alone - for a formative part of your life. In your time apart from the clamor of society, you found quiet, solitude, and perhaps some of the answers you were looking for.',
    equipment: 'A scroll case stuffed full of notes from your studies or prayers, a winter blanket, a set of common clothes, an herbalism kit, and 5 gp.',
    additionalLanguages: 1,
    proficiencies: {
      skills: ['medicine', 'religion'],
      tools: [{ name: 'herbalism kit' }],
    },
  },
  {
    key: 'noble',
    name: 'Noble',
    description: 'You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence. You might be a pampered aristocrat unfamiliar with work or discomfort, a former merchant just elevated to the nobility, or a disinherited scoundrel with a disproportionate sense of entitlement.',
    equipment: 'A set of fine clothes, a signet ring, a scroll of pedigree, and a purse containing 25gp.',
    additionalLanguages: 1,
    proficiencies: {
      skills: ['history', 'persuasion'],
      tools: [{ tag: 'gaming set', quantity: 1 }],
    },
  },
  {
    key: 'outlander',
    name: 'Outlander',
    description: 'You grew up in the wilds, far from civilization and the comforts of town and technology. You\'ve witnessed the migration of herds larger than forests, survived weather more extreme than any city-dweller could comprehend, and enjoyed the solitude of being the only thinking creature for miles in any direction.',
    equipment: 'A staff, a hunting trap, a trophy from an animal you killed, a set of traveler\'s clothes, and a belt pouch containing 10 gp.',
    additionalLanguages: 1,
    proficiencies: {
      skills: ['athletics', 'survival'],
      tools: [{ tag: 'musical instruments', quantity: 1 }],
    },
  },
  {
    key: 'sage',
    name: 'Sage',
    description: 'You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you. Your efforts have made you a master in your fields of study.',
    equipment: 'A bottle of black ink, a quill, a small knife, a letter from a dead colleague posing a question you have not been able to answer, a set of common clothes, and a belt pouch containing 10gp.',
    additionalLanguages: 2,
    proficiencies: {
      skills: ['arcana', 'history'],
      tools: [],
    },
  },
  {
    key: 'sailor',
    name: 'Sailor',
    description: 'You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft to the bottom less depths. Your first love is the distant line of the horizon, but the time has come to try your hand at something new.',
    equipment: 'A belaying pin (club), 50 feet of silk rope, a lucky charm such as a rabbit foot or a small stone with a hole in the center (or may roll for a trinket), a set of common clothes, and a belt pouch containing 10gp.',
    additionalLanguages: 0,
    proficiencies: {
      skills: ['athletics', 'perception'],
      tools: [
        { name: 'navigator\'s tools' },
        { name: 'water vehicles' },
      ],
    },
  },
  {
    key: 'soldier',
    name: 'Soldier',
    description: 'War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield.',
    equipment: 'An insignia of rank, a trophy taken from a fallen enemy, a set of bone dice or deck of cards, a set of common clothes, and a belt pouch containing 10gp.',
    additionalLanguages: 0,
    proficiencies: {
      skills: ['athletics', 'intimidation'],
      tools: [
        { tag: 'gaming set', quantity: 1 },
        { name: 'land vehicles' },
      ],
    },
  },
  {
    key: 'urchin',
    name: 'Urchin',
    description: 'You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or to provide for you, so you learned to provide for yourself.',
    equipment: 'A small knife, a map of the city you grew up in, a pet mouse, a token to remember your parents by, a set of common clothes, and a belt pouch containing 10gp.',
    additionalLanguages: 0,
    proficiencies: {
      skills: ['sleight of hand', 'stealth'],
      tools: [
        { name: 'disguise kit' },
        { name: 'thieves\' tools' },
      ],
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
