import IMAGES from './Images';

export default [
  {
    key: 'dwarf',
    name: 'Dwarf',
    plural: 'Dwarves',
    description: 'These short and stocky defenders of mountain fortresses are often seen as stern and humorless; they\'re known for mining the earth\'s treasures and crafting magnificent items from ore and gemstones.',
    speed: 25,
    age: { adulthood: 50, lifespan: 350 },
    alignment: {
      include: ['lawful', 'good'],
      exclude: ['chaotic', 'evil'],
    },
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
    plural: 'Elves',
    description: 'Tall, noble, and often haughty, elves are long-lived and subtle masters of the wilderness, and excel in the arcane arts.',
    speed: 30,
    age: { adulthood: 100, lifespan: 750 },
    alignment: {
      include: ['chaotic', 'good'],
      exclude: ['lawful', 'evil'],
    },
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
    plural: 'Halflings',
    description: 'Members of this diminutive race find strength in family, community, and their own innate and seemingly inexhaustible luck.',
    speed: 25,
    age: { adulthood: 20, lifespan: 250 },
    alignment: {
      include: ['lawful', 'good'],
      exclude: ['chaotic', 'evil'],
    },
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
    plural: 'Humans',
    description: 'Ambitious, sometimes heroic, and always confident, humans have an ability to work together toward common goals that makes them a force to be reckoned with.',
    speed: 30,
    age: { adulthood: 18, lifespan: 100 },
    alignment: {
      include: ['lawful', 'good'],
      exclude: ['chaotic', 'evil'],
    },
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
    plural: 'Dragonborns',
    description: 'Born to fight, dragonborn are a race of wandering mercenaries, soldiers, and adventurers.',
    speed: 30,
    age: { adulthood: 15, lifespan: 80 },
    alignment: {
      include: ['good'],
      exclude: ['evil'],
    },
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
    plural: 'Gnomes',
    description: 'Gnomes are whimsical artisans and tinkers, creating strange devices powered by magic, alchemy, and their quirky imagination; they have an insatiable need for new experiences that often gets them in trouble.',
    speed: 25,
    age: { adulthood: 40, lifespan: 500 },
    alignment: {
      include: ['good'],
      exclude: ['evil'],
    },
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
    name: 'Half-elf',
    plural: 'Half-elves',
    description: 'Often caught between the worlds of their progenitor races, half-elves are a race of both grace and contradiction.',
    speed: 30,
    age: { adulthood: 20, lifespan: 180 },
    alignment: {
      include: ['good'],
      exclude: ['evil'],
    },
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
    name: 'Half-orc',
    plural: 'Half-orcs',
    description: 'Often fierce and savage, sometimes noble and resolute, half-orcs can manifest the best and worst qualities of their parent races.',
    speed: 30,
    age: { adulthood: 14, lifespan: 75 },
    alignment: {
      include: ['chaotic', 'evil'],
      exclude: ['lawful', 'good'],
    },
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
    plural: 'Tieflings',
    description: 'Tieflings, often descendants of fiends and humans, are known for their cunning, allure, and leadership.',
    speed: 30,
    age: { adulthood: 18, lifespan: 100 },
    alignment: {
      include: ['chaotic', 'evil'],
      exclude: ['lawful', 'good'],
    },
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
