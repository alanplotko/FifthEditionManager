export const toTitleCase = str =>
  `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;

export const getCharacterDisplayName = character =>
  `${toTitleCase(character.profile.firstName)} ${toTitleCase(character.profile.lastName)}`;

export const validateInteger = (value, altErrorMessage) => {
  if (value === null || value === undefined) return 'Required';
  return (value % 1 !== 0) ? 'Integer only' : altErrorMessage;
};
