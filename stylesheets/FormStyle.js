import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  heading: {
    fontSize: 24,
    fontFamily: 'Roboto',
    color: '#000',
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
    marginBottom: 20,
  },
  horizontalLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitBtnText: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center',
  },
  submitBtn: {
    height: 48,
    backgroundColor: '#3F51B5',
    borderColor: '#3F51B5',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
