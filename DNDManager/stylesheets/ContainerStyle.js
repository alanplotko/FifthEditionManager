import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  centerScreen: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: '#666'
  }
});