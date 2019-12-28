import React from 'react'; // Needed for any JSX in a file
import { Text } from 'react-native';
import { COLOR } from 'react-native-material-ui';

export const toTitleCase = str => str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

export const reformatCamelCaseKey = key => key.split(/(?=[A-Z])/).join(' ').toLowerCase();

export const toProperList = (list, lastWord, capitalize) => {
  if (list.length === 0) return '';
  if (list.length === 1) return capitalize ? toTitleCase(list[0]) : list[0];
  if (list.length === 2) {
    const first = capitalize ? toTitleCase(list[0]) : list[0];
    const last = capitalize ? toTitleCase(list[1]) : list[1];
    return `${first} ${lastWord} ${last}`;
  }
  const newList = [...list];
  const lastItem = newList.pop();
  return capitalize
    ? `${toTitleCase(newList.join(', '))}, ${lastWord} ${toTitleCase(lastItem)}`
    : `${newList.join(', ')}, ${lastWord} ${lastItem}`;
};

export const getCharacterDisplayName = character => `${toTitleCase(character.profile.firstName)} ${toTitleCase(character.profile.lastName)}`;

export const validateInteger = (value, altErrorMessage) => {
  if (value === null || value === undefined) return 'Required';
  return (value % 1 !== 0) ? 'Integer only' : altErrorMessage;
};

// Hide leading 0 used for lining up single-digit numbers
export const formatSingleDigit = val => (
  val < 10 ?
    (<Text><Text style={{ color: COLOR.transparent }}>0</Text>{val}</Text>) :
    (<Text>{val}</Text>)
);

export const reverseSort = (a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

export const calculateModifier = score => Math.floor((score - 10) / 2);

export const calculateProficiencyBonus = level => Math.ceil(level / 4) + 1;
