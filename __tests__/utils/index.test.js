import * as util from 'FifthEditionManager/util';

describe('Utility function', () => {
  test('toTitleCase works correctly', () => {
    expect(util.toTitleCase('sample title')).toEqual('Sample Title');
  });

  test('reformatCamelCaseKey works correctly', () => {
    expect(util.reformatCamelCaseKey('sampleKey')).toEqual('sample key');
  });

  test('toProperList works correctly', () => {
    expect(util.toProperList([], 'and', false)).toEqual('');
    expect(util.toProperList(['test'], 'and', false)).toEqual('test');
    expect(util.toProperList(['test'], 'and', true)).toEqual('Test');
    expect(util.toProperList(['a', 'b'], 'and', false)).toEqual('a and b');
    expect(util.toProperList(['a', 'b'], 'and', true)).toEqual('A and B');
    expect(util.toProperList(['a', 'b', 'c'], 'and', false)).toEqual('a, b, and c');
    expect(util.toProperList(['a', 'b', 'c'], 'and', true)).toEqual('A, B, and C');
  });

  test('getCharacterDisplayName works correctly', () => {
    const character = {
      profile: {
        firstName: 'first',
        lastName: 'last',
      },
    };
    expect(util.getCharacterDisplayName(character)).toEqual('First Last');
  });

  test('validateInteger works correctly', () => {
    expect(util.validateInteger(null, 'Error')).toEqual('Required');
    expect(util.validateInteger(undefined, 'Error')).toEqual('Required');
    expect(util.validateInteger(3.5, 'Error')).toEqual('Integer only');
    expect(util.validateInteger(3, 'Error')).toEqual('Error');
  });

  test('formatSingleDigit works correctly', () => {
    // Check for original value '5' with transparent text needed to align with double-digit numbers
    let wrapper = shallow(util.formatSingleDigit(5));
    expect(wrapper.children().at(0).dive().text()).toEqual('0');
    expect(wrapper.children().at(1).text()).toEqual('5');
    expect(wrapper).toMatchSnapshot();

    // Check for original value '10' with no transparent text needed
    wrapper = shallow(util.formatSingleDigit(10));
    expect(wrapper.text()).toEqual('10');
    expect(wrapper).toMatchSnapshot();
  });

  test('reverseSort works correctly', () => {
    expect([2, 3, 1, 4, 5, 2, 3, 1, 4, 5].sort(util.reverseSort))
      .toEqual([5, 5, 4, 4, 3, 3, 2, 2, 1, 1]);
  });

  test('calculateModifier works correctly', () => {
    // Test on standard score set
    expect(util.calculateModifier(15)).toEqual(2);
    expect(util.calculateModifier(14)).toEqual(2);
    expect(util.calculateModifier(13)).toEqual(1);
    expect(util.calculateModifier(12)).toEqual(1);
    expect(util.calculateModifier(10)).toEqual(0);
    expect(util.calculateModifier(8)).toEqual(-1);
  });

  test('calculateProficiencyBonus works correctly', () => {
    // Test all 20 standard levels
    const proficiencyBonuses = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];
    proficiencyBonuses.forEach((proficiencyBonus, index) =>
      expect(util.calculateProficiencyBonus(index + 1)).toEqual(proficiencyBonus));
  });
});
