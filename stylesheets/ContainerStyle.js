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
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: COLOR.grey700,
  },
});
