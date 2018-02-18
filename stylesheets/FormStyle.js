import { StyleSheet } from 'react-native';
import { COLOR } from 'react-native-material-ui';

export default StyleSheet.create({
  heading: {
    fontSize: 24,
    fontFamily: 'Roboto',
    color: COLOR.black,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.grey500,
    marginBottom: 20,
  },
  horizontalLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    position: 'absolute',
    top: 0,
    width: '100%',
    fontFamily: 'RobotoBold',
    color: COLOR.white,
    fontSize: 16,
    backgroundColor: COLOR.grey800,
    paddingVertical: 5,
    paddingHorizontal: 18,
  },
});
