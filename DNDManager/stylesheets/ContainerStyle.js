import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paddedContainer: {
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: '#666'
  }
});
