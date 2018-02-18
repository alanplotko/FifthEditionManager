import { StyleSheet } from 'react-native';
import { COLOR } from 'react-native-material-ui';

export default StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: COLOR.grey200,
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
    color: COLOR.grey700,
  },
});
