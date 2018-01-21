import React from 'react'; // Needed for any JSX in file
import { Text } from 'react-native';

export const toTitleCase = str =>
  `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;

export const getCharacterDisplayName = character =>
  `${toTitleCase(character.profile.firstName)} ${toTitleCase(character.profile.lastName)}`;

export const validateInteger = (value, altErrorMessage) => {
  if (value === null || value === undefined) return 'Required';
  return (value % 1 !== 0) ? 'Integer only' : altErrorMessage;
};

// Hide leading 0 used for lining up single-digit numbers
export const formatSingleDigit = val => (
  val < 10 ?
    (<Text><Text style={{ color: 'transparent' }}>0</Text>{val}</Text>) :
    (<Text>{val}</Text>)
);

export const reverseSort = (a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

export const calculateModifier = score => Math.floor((score - 10) / 2);

export const calculateProficiencyBonus = level => Math.ceil(level / 4) + 1;
