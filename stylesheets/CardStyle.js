import { StyleSheet } from 'react-native';
import { COLOR } from 'react-native-material-ui';

export default StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 0,
    marginVertical: 10,
  },
  containerNarrow: {
    padding: 10,
    marginHorizontal: 0,
    marginVertical: 5,
  },
  cardHeading: {
    fontFamily: 'RobotoLight',
    color: COLOR.black,
    fontSize: 24,
    paddingBottom: 10,
  },
  cardText: {
    fontFamily: 'Roboto',
    color: COLOR.grey700,
    fontSize: 16,
    paddingBottom: 5,
  },
  extraPadding: {
    paddingBottom: 30,
  },
  cardNote: {
    fontFamily: 'Roboto',
    color: COLOR.grey700,
    fontSize: 14,
    marginTop: 5,
  },
  makeBold: {
    fontFamily: 'RobotoBold',
  },
  makeItalic: {
    fontStyle: 'italic',
  },
});
