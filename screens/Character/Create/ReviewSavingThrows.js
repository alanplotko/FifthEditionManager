import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, COLOR, Icon, ListItem, Toolbar } from 'react-native-material-ui';
import Note from 'FifthEditionManager/components/Note';
import { ABILITIES, CLASSES } from 'FifthEditionManager/config/Info';
import { toTitleCase, toProperList } from 'FifthEditionManager/util';
import { CardStyle, ContainerStyle } from 'FifthEditionManager/stylesheets';
import { cloneDeep, zipObject } from 'lodash';

export default class ReviewSavingThrows extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Review Saving Throws',
      };
      return <Toolbar {...props} />;
    },
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static contextTypes = {
    uiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isNoteCollapsed: true,
      ...props.navigation.state.params,
    };
    this.state.baseClass = CLASSES
      .find(option => option.key === this.state.character.profile.baseClass.lookupKey);
    this.state.savingThrows = zipObject(
      ABILITIES,
      ABILITIES.map((ability) => {
        const { modifier } = this.state.character.profile.stats[ability];
        const proficient = this.state.baseClass.proficiencies.savingThrows
          .includes(ability);
        const bonus = proficient ? this.state.character.profile.proficiency : 0;
        return { modifier, proficient, total: modifier + bonus };
      }),
    );
  }

  setSavingThrows = () => {
    const { navigate, state } = this.props.navigation;
    state.params.character.lastUpdated = Date.now();
    state.params.character.profile.savingThrows =
      cloneDeep(this.state.savingThrows);
    navigate('ReviewHitPoints', { ...state.params });
  }

  toggleNote = () => {
    this.setState({
      isNoteCollapsed: !this.state.isNoteCollapsed,
    });
  }

  render() {
    // Theme setup
    const { textColor } = this.context.uiTheme.palette;
    const textStyle = { color: textColor };

    const baseClassProficiencies = this.state.baseClass.proficiencies
      .savingThrows.slice(0);
    const ListItemRow = (ability) => {
      const isChecked = baseClassProficiencies.includes(ability);
      const { modifier } = this.state.character.profile.stats[ability];
      const negative = modifier < 0;
      const total = modifier + this.state.character.profile.proficiency;
      const checkedTextColor = total < 0 ? COLOR.red500 : COLOR.green500;
      const uncheckedTextColor = modifier < 0 ? COLOR.red500 : COLOR.green500;
      return (
        <ListItem
          key={ability}
          divider
          centerElement={
            <View style={styles.horizontalLayout}>
              <Text style={[styles.smallHeading, textStyle, { marginBottom: 10 }]}>
                {toTitleCase(ability)}
              </Text>
              <Text
                style={[
                  styles.smallHeading,
                  CardStyle.makeBold,
                  { color: isChecked ? textColor : uncheckedTextColor },
                ]}
              >
                {
                  !isChecked && negative &&
                  <Text>&minus;{Math.abs(modifier)}</Text>
                }
                {
                  !isChecked && !negative &&
                  <Text>+{modifier}</Text>
                }
                {
                  isChecked &&
                  <Text>
                    {
                      negative &&
                      <Text>&minus;</Text>
                    }
                    {
                      !negative &&
                      <Text>+</Text>
                    }
                    {Math.abs(modifier)}
                    &nbsp;+&nbsp;
                    {this.state.character.profile.proficiency} =&nbsp;
                    <Text style={{ color: checkedTextColor }}>
                      {total >= 0 ? <Text>+</Text> : <Text>&minus;</Text>}
                      {Math.abs(total)}
                    </Text>
                  </Text>
                }
              </Text>
            </View>
          }
          rightElement={
            <Icon
              name="check-circle"
              color={isChecked ? COLOR.green500 : COLOR.grey600}
              style={{ opacity: 0.5, paddingHorizontal: 12 }}
            />
          }
        />
      );
    };

    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const classIndefiniteArticle = vowels
      .includes(this.state.baseClass.name.charAt(0).toLowerCase()) ? 'an' : 'a';

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20 }}>
            <Note
              title="Saving Throws"
              type="info"
              icon="info"
              collapsible
              isCollapsed={this.state.isNoteCollapsed}
              toggleNoteHandler={this.toggleNote}
              uiTheme={this.context.uiTheme}
            >
              <Text style={{ marginBottom: 10 }}>
                As {classIndefiniteArticle}
                <Text style={CardStyle.makeBold}>
                  &nbsp;{this.state.baseClass.name}
                </Text>
                , you have proficiency in saving throws for
                <Text style={CardStyle.makeBold}>
                  &nbsp;{toProperList(baseClassProficiencies, 'and', true)}
                </Text>
                . The saving throws derive from your ability modifiers and
                have your proficiency bonus added where proficient.
              </Text>
            </Note>
            <View style={styles.buttonLayout}>
              <Button
                primary
                raised
                text="Proceed"
                onPress={() => this.setSavingThrows()}
                style={{
                  container: { width: '100%', marginTop: 10, marginBottom: 20 },
                }}
              />
            </View>
            <ListItem
              divider
              centerElement={
                <View style={styles.horizontalLayout}>
                  <Text style={styles.smallHeading}>Saving Throw</Text>
                  <Text style={styles.smallHeading}>Proficient</Text>
                </View>
              }
            />
            {ABILITIES.map(ability => ListItemRow(ability))}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  horizontalLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallHeading: {
    fontFamily: 'RobotoLight',
    color: COLOR.black,
    fontSize: 18,
  },
  buttonLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
