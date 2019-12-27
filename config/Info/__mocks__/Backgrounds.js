export default [
  {
    key: 'acolyte',
    name: 'Acolyte',
    description: 'You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine.',
    starting: {
      decisions: [
        [
          {
            name: 'Prayer book',
            description: null,
            quantity: 1,
            unit: null,
          },
          {
            name: 'Prayer wheel',
            description: null,
            quantity: 1,
            unit: null,
          },
        ],
      ],
      equipment: [
        {
          name: 'Holy symbol',
          description: 'A gift to you when you entered the priesthood.',
          quantity: 1,
          unit: null,
        },
        {
          name: 'Stick of incense',
          description: null,
          quantity: 5,
          unit: { singular: 'stick', plural: 'sticks' },
        },
        {
          name: 'Vestments',
          description: null,
          quantity: null,
          unit: null,
        },
        {
          name: 'Common clothes',
          description: null,
          quantity: 1,
          unit: { singular: 'set', plural: 'sets' },
        },
      ],
      money: {
        gp: 15,
      },
    },
    additionalLanguages: 2,
    proficiencies: {
      skills: ['insight', 'religion'],
      skillKeys: ['insight', 'religion'],
      tools: [],
    },
  },
  {
    key: 'emptyBackgroundTest',
    name: 'Empty Background Test',
    description: 'This test covers display of little information on the background selection screen.',
    starting: {
      decisions: [],
      equipment: [],
      money: null,
    },
    additionalLanguages: 0,
    proficiencies: {
      skills: [],
      skillKeys: [],
      tools: [],
    },
  },
  {
    key: 'testConsolidateItems',
    name: 'Test Consolidate Items',
    description: 'If a decision item is also a starting item, consolidate and update quantity in inventory.',
    starting: {
      decisions: [
        [
          {
            name: 'Prayer book',
            description: null,
            quantity: 1,
            unit: null,
          },
          {
            name: 'Prayer wheel',
            description: null,
            quantity: 1,
            unit: null,
          },
        ],
      ],
      equipment: [
        {
          name: 'Prayer book',
          description: null,
          quantity: 1,
          unit: null,
        },
        {
          name: 'Prayer wheel',
          description: null,
          quantity: 1,
          unit: null,
        },
      ],
      money: null,
    },
    additionalLanguages: 0,
    proficiencies: {
      skills: [],
      skillKeys: [],
      tools: [],
    },
  },
  {
    key: 'testIgnoreDuplicateItems',
    name: 'Test Ignore Duplicate Items',
    description: 'If a decision item is also a starting item without an explicit quantity, ignore the duplicate item when setting up the inventory.',
    starting: {
      decisions: [
        [
          {
            name: 'Vestments A',
            description: null,
            quantity: null,
            unit: null,
          },
          {
            name: 'Vestments B',
            description: null,
            quantity: null,
            unit: null,
          },
        ],
      ],
      equipment: [
        {
          name: 'Vestments A',
          description: null,
          quantity: null,
          unit: null,
        },
        {
          name: 'Vestments B',
          description: null,
          quantity: null,
          unit: null,
        },
      ],
      money: null,
    },
    additionalLanguages: 0,
    proficiencies: {
      skills: [],
      skillKeys: [],
      tools: [],
    },
  },
  {
    key: 'testMultipleDecisions',
    name: 'Test Multiple Decisions',
    description: 'Test having multiple decisions.',
    starting: {
      decisions: [
        [
          {
            name: 'Vestments A',
            description: null,
            quantity: null,
            unit: null,
          },
          {
            name: 'Vestments B',
            description: null,
            quantity: null,
            unit: null,
          },
        ],
        [
          {
            name: 'Vestments C',
            description: null,
            quantity: null,
            unit: null,
          },
          {
            name: 'Vestments D',
            description: null,
            quantity: null,
            unit: null,
          },
        ],
      ],
      equipment: [
        {
          name: 'Vestments A',
          description: null,
          quantity: null,
          unit: null,
        },
        {
          name: 'Vestments B',
          description: null,
          quantity: null,
          unit: null,
        },
      ],
      money: null,
    },
    additionalLanguages: 0,
    proficiencies: {
      skills: [],
      skillKeys: [],
      tools: [],
    },
  },
  {
    key: 'oneAdditionalLanguageTest',
    name: 'One Additional Language Test',
    description: 'This test covers displaying the singular "language" instead of the plural in the case of 1 additional language.',
    starting: {
      decisions: [],
      equipment: [],
      money: null,
    },
    additionalLanguages: 1,
    proficiencies: {
      skills: [],
      skillKeys: [],
      tools: [],
    },
  },
  {
    key: 'toolProficienciesTest',
    name: 'Tool Proficiencies Test',
    description: 'This test covers displaying tool proficiencies.',
    starting: {
      decisions: [],
      equipment: [],
      money: null,
    },
    additionalLanguages: 0,
    proficiencies: {
      skills: [],
      skillKeys: [],
      tools: [{
        options: [
          { tag: 'artisan\'s tools', quantity: 1 },
          { tag: 'musical instruments', quantity: 1 },
        ],
      }, {
        name: 'thieves\' tools',
      }, {
        tag: 'musical instruments', quantity: 3,
      },
      {}], // Test empty tool object
    },
  },
];
