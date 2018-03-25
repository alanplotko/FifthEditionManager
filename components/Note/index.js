import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { COLOR, Icon, IconToggle } from 'react-native-material-ui';
import DefaultTheme from 'FifthEditionManager/themes/DefaultTheme';

const Note = (props) => {
  // Note style and icon setup
  let iconColor = COLOR.black; // Default
  let noteTypeStyle = null;
  if (props.type === 'error') {
    iconColor = COLOR.red500;
    noteTypeStyle = styles.error;
  } else if (props.type === 'tip') {
    iconColor = COLOR.blueGrey500;
    noteTypeStyle = styles.tip;
  } else if (props.type === 'info') {
    iconColor = COLOR.lightBlue500;
    noteTypeStyle = styles.info;
  }

  // Theme setup
  const { textColor } = props.uiTheme.palette;
  const textStyle = { color: textColor };

  return (
    <View style={[styles.note, noteTypeStyle]}>
      {
        props.collapsible &&
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          <IconToggle
            name={props.isCollapsed ? 'arrow-drop-down' : 'arrow-drop-up'}
            color={iconColor}
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
          marginBottom: !props.isCollapsed || !props.collapsible ? 10 : 0,
        }}
      >
        {
          props.icon &&
          <Icon
            name={props.icon}
            color={iconColor}
            style={{ marginRight: 10 }}
          />
        }
        <Text style={[styles.noteHeading, textStyle]}>
          {props.title}
        </Text>
      </View>
      {
        (!props.collapsible || !props.isCollapsed) &&
        <View>
          <Text style={[styles.noteText, textStyle]}>
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
  note: {
    borderWidth: 0.5,
    borderRadius: 3,
    marginBottom: 15,
    padding: 15,
  },
  noteHeading: {
    fontFamily: 'RobotoBold',
    color: COLOR.black,
    fontSize: 18,
  },
  noteText: {
    fontFamily: 'Roboto',
    color: COLOR.black,
    fontSize: 14,
  },
  errorTimestamp: {
    textAlign: 'right',
    fontStyle: 'italic',
    marginTop: 10,
  },
  tip: {
    backgroundColor: COLOR.blueGrey50,
    borderColor: COLOR.blueGrey500,
  },
  error: {
    backgroundColor: COLOR.red50,
    borderColor: COLOR.red500,
  },
  info: {
    backgroundColor: COLOR.lightBlue50,
    borderColor: COLOR.lightBlue500,
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
