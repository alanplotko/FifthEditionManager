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
];
