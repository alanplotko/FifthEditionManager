import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { COLOR, Icon, IconToggle } from 'react-native-material-ui';
import DefaultTheme from 'FifthEditionManager/themes/DefaultTheme';

const Note = (props) => {
  // Note color setup
  let color = COLOR.lightBlue500; // Default for info note
  if (props.type === 'error') {
    color = COLOR.red500;
  }

  // Theme setup
  const { textColor } = props.uiTheme.palette;
  const textStyle = { color: textColor };

  return (
    <View style={props.type === 'info' ? styles.infoNote : styles.errorNote}>
      {
        props.collapsible &&
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          <IconToggle
            name={props.isCollapsed ? 'arrow-drop-down' : 'arrow-drop-up'}
            color={color}
            size={28}
            percent={50}
            onPress={() => props.toggleNoteHandler()}
          />
        </View>
      }
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginBottom: !props.isCollapsed ? 10 : 0,
        }}
      >
        {
          props.icon &&
          <Icon
            name={props.icon}
            color={color}
            style={{ marginRight: 10 }}
          />
        }
        <Text style={[props.type === 'info' ? styles.infoHeading : styles.errorHeading, textStyle]}>
          {props.title}
        </Text>
      </View>
      {
        (!props.collapsible || !props.isCollapsed) &&
        <View style={{}}>
          <Text style={[props.type === 'info' ? styles.infoText : styles.errorText, textStyle]}>
            {props.children}
          </Text>
          {
            props.type === 'error' &&
            <Text style={styles.errorTimestamp}>
              Last attempted {moment().format('h:mm:ss A')}
            </Text>
          }
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  infoNote: {
    backgroundColor: COLOR.lightBlue50,
    borderWidth: 0.5,
    borderColor: COLOR.lightBlue500,
    borderRadius: 3,
    marginBottom: 15,
    padding: 15,
  },
  infoHeading: {
    fontFamily: 'RobotoBold',
    color: COLOR.black,
    fontSize: 18,
  },
  infoText: {
    fontFamily: 'Roboto',
    color: COLOR.black,
    fontSize: 14,
  },
  errorNote: {
    backgroundColor: COLOR.red50,
    borderWidth: 0.5,
    borderColor: COLOR.red500,
    borderRadius: 3,
    marginBottom: 15,
    padding: 15,
  },
  errorHeading: {
    fontFamily: 'RobotoBold',
    color: COLOR.black,
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'Roboto',
    color: COLOR.black,
    fontSize: 14,
  },
  errorTimestamp: {
    textAlign: 'right',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

Note.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.string,
  type: PropTypes.string.isRequired,
  collapsible: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  // Require function only when collapsible prop is true
  toggleNoteHandler: (props, propName, componentName) => {
    const value = props[propName];
    if (props.collapsible) {
      if (!value) {
        return new Error(`Prop \`${propName}\` not supplied to \`${componentName}\`. Required when note is collapsible. Validation failed.`);
      } else if (typeof value !== 'function') {
        return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Type \`function\` expected. Validation failed.`);
      }
    }
    return null;
  },
  uiTheme: PropTypes.object,
};

Note.defaultProps = {
  icon: null,
  collapsible: false,
  isCollapsed: false,
  toggleNoteHandler: undefined,
  uiTheme: DefaultTheme,
};

export default Note;
