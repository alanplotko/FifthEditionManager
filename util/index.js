export const toTitleCase = str =>
  `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;

export const getCharacterDisplayName = character =>
  `${toTitleCase(character.profile.firstName)} ${toTitleCase(character.profile.lastName)}`;
