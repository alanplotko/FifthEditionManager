import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { COLOR, Icon, IconToggle } from 'react-native-material-ui';

const Note = (props) => {
  const {
    title,
    children,
    icon,
    type,
    collapsible,
    isCollapsed,
    toggleNoteHandler,
  } = props;

  let color = COLOR.yellow500;
  if (type === 'info') {
    color = COLOR.lightBlue500;
  } else if (type === 'error') {
    color = COLOR.red500;
  }

  return (
    <View style={styles[`${type}Note`]}>
      {
        collapsible &&
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          <IconToggle
            name={isCollapsed ? 'arrow-drop-down' : 'arrow-drop-up'}
            color={color}
            size={28}
            percent={50}
            onPress={() => toggleNoteHandler()}
          />
        </View>
      }
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginBottom: !isCollapsed ? 10 : 0,
        }}
      >
        {
          icon &&
          <Icon
            name={icon}
            color={color}
            style={{ marginRight: 10 }}
          />
        }
        <Text style={styles[`${type}Heading`]}>
          {title}
        </Text>
      </View>
      {
        !isCollapsed &&
        <View>
          <Text style={styles[`${type}Text`]}>
            {children}
          </Text>
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
    color: '#000',
    fontSize: 18,
  },
  infoText: {
    fontFamily: 'Roboto',
    color: '#000',
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
    color: '#000',
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'Roboto',
    color: '#000',
    fontSize: 14,
  },
});

Note.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.string,
  type: PropTypes.string,
  collapsible: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  toggleNoteHandler: PropTypes.func,
};

Note.defaultProps = {
  title: '',
  children: null,
  icon: null,
  type: '',
  collapsible: true,
  isCollapsed: false,
  toggleNoteHandler: () => null,
};

export default Note;
