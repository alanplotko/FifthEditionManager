import { StyleSheet } from 'react-native';
import { COLOR } from 'react-native-material-ui';

export default StyleSheet.create({
  infoDialog: {
    backgroundColor: COLOR.lightBlue50,
    borderWidth: 0.5,
    borderColor: COLOR.lightBlue500,
    borderRadius: 3,
    marginBottom: 15,
    padding: 15,
  },
  infoHeading: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 18,
  },
  infoText: {
    fontFamily: 'Roboto',
    color: '#000',
    fontSize: 14,
  },
  errorDialog: {
    backgroundColor: COLOR.red50,
    borderWidth: 0.5,
    borderColor: COLOR.red500,
    borderRadius: 3,
    marginBottom: 15,
    padding: 15,
  },
  errorHeading: {
    fontFamily: 'RobotoBold',
    color: '#000',
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'Roboto',
    color: '#000',
    fontSize: 14,
  },
});
