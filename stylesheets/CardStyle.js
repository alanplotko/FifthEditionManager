import { StyleSheet } from 'react-native';
import { COLOR } from 'react-native-material-ui';

export default StyleSheet.create({
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
  container: {
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  makeBold: {
    fontFamily: 'RobotoBold',
  },
});
