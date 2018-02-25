import { COLOR } from 'react-native-material-ui';

const DefaultTheme = {
  palette: {
    // Main colors
    primaryColor: COLOR.indigo500,
    accentColor: COLOR.red500,
    backgroundColor: COLOR.grey200,
    modalBackgroundColor: COLOR.white,
    fadedBackgroundColor: 'rgba(0, 0, 0, 0.7)',
    disabledColor: COLOR.grey300,
    // Text colors
    textColor: COLOR.black,
    fadedTextColor: COLOR.grey700,
    noteColor: COLOR.grey500,
    // Icon colors
    iconColor: COLOR.grey600,
    backdropIconColor: COLOR.grey400,
    standardDiceColor: COLOR.grey800,
    highlightedDiceColor: COLOR.red500,
  },
  toolbar: {
    container: {
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,
      },
      shadowRadius: 0,
      elevation: 0,
    },
  },
};

export default DefaultTheme;
