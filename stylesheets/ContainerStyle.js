import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#eee',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  padded: {
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: '#666',
  },
});
