import IMAGES from 'FifthEditionManager/config/Info/Images';

export default {
  barbarian: {
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
        optionKeys: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.barbarian,
  },
  bard: {
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
  cleric: {
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
        optionKeys: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.cleric,
  },
  druid: {
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
        optionKeys: ['arcana', 'animalHandling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.druid,
  },
  fighter: {
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
        optionKeys: ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.fighter,
  },
  monk: {
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
        optionKeys: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.monk,
  },
  paladin: {
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
        optionKeys: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.paladin,
  },
  ranger: {
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
        optionKeys: ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
        quantity: 3,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.ranger,
  },
  rogue: {
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
        optionKeys: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth'],
        quantity: 4,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.rogue,
  },
  sorcerer: {
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
        optionKeys: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.sorcerer,
  },
  warlock: {
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
        optionKeys: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.warlock,
  },
  wizard: {
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
        optionKeys: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
        quantity: 2,
      },
    },
    image: IMAGES.BASE_CLASS.ICON.wizard,
  },
  testLackOfDetails: {
    key: 'testLackOfDetails',
    name: 'Test Lack Of Details',
    description: 'Description text.',
    hitDie: 8,
    proficiencies: {
      savingThrows: [],
      armor: [],
      weapons: [],
      tools: [{}, {}, {}], // Empty tool objects
      skills: {
        options: [],
        optionKeys: [],
        quantity: 2,
      },
    },
    image: null,
  },
};