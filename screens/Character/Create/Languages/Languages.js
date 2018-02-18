import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, COLOR, Icon, IconToggle, ListItem, Toolbar }
  from 'react-native-material-ui';
import { ContainerStyle, CardStyle } from 'FifthEditionManager/stylesheets';
import Note from 'FifthEditionManager/components/Note';
import { RACES, BACKGROUNDS, LANGUAGES } from 'FifthEditionManager/config/Info';
import { toTitleCase, toProperList } from 'FifthEditionManager/util';
import { cloneDeep } from 'lodash';

export default class Languages extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Assign Languages',
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
      allLanguages: cloneDeep(LANGUAGES),
      selectedLanguages: [],
      isNoteCollapsed: true,
      ...props.navigation.state.params,
    };

    this.state.race = RACES
      .find(option => option.key === this.state.character.profile.race.lookupKey);
    this.state.background = BACKGROUNDS
      .find(option => option.key === this.state.character.profile.background.lookupKey);

    // Set existing languages and remaining languages to select
    this.state.knownLanguages = this.state.race.languages;
    this.state.additionalLanguages = this.state.race.additionalLanguages +
      this.state.background.additionalLanguages;
    this.state.remainingLanguages = this.state.additionalLanguages;
  }

  setLanguages = () => {
    const { navigate, state } = this.props.navigation;
    state.params.character.lastUpdated = Date.now();
    state.params.character.profile.languages = this.state.knownLanguages
      .slice(0).concat(this.state.selectedLanguages.slice(0));
    navigate('ReviewSavingThrows', { ...state.params });
  }

  resetLanguages = () => {
    this.setState({
      selectedLanguages: [],
      remainingLanguages: this.state.additionalLanguages,
    });
  }

  toggleLanguage = (key) => {
    let selectedLanguages = this.state.selectedLanguages.slice(0);
    let { remainingLanguages } = this.state;
    if (selectedLanguages.includes(key)) {
      selectedLanguages = selectedLanguages
        .filter(language => language !== key);
      remainingLanguages += 1;
    } else {
      selectedLanguages.push(key);
      remainingLanguages -= 1;
    }
    this.setState({ selectedLanguages, remainingLanguages });
  }

  toggleLanguageNote = () => {
    this.setState({
      isNoteCollapsed: !this.state.isNoteCollapsed,
    });
  }

  render() {
    // Theme setup
    const { textColor } = this.context.uiTheme.palette;
    const textStyle = { color: textColor };

    const ListItemRow = (languageData) => {
      const key = languageData.language;
      const isChecked = this.state.knownLanguages.includes(key) ||
        this.state.selectedLanguages.includes(key);
      return (
        <ListItem
          key={key}
          divider
          style={{
            container: {
              height: 70,
            },
          }}
          centerElement={
            <View style={styles.horizontalLayout}>
              <Text>
                <Text style={[styles.smallHeading, textStyle, { marginBottom: 10 }]}>
                  {toTitleCase(key)}{'\n'}
                </Text>
                <Text style={[styles.additionalInfo, textStyle]}>
                  &emsp;&#9656; Typically spoken by:&nbsp;
                  {toTitleCase(languageData.speakers.join(', '))}{'\n'}
                  &emsp;&#9656; Script: {toTitleCase(languageData.script)}{'\n'}
                </Text>
              </Text>
            </View>
          }
          rightElement={
            this.state.knownLanguages.includes(key) ?
              <Icon
                name="check-circle"
                color={COLOR.green500}
                size={36}
                style={{ opacity: 0.5, paddingHorizontal: 18 }}
              /> :
              <IconToggle
                name="check-circle"
                color={isChecked ? COLOR.green500 : COLOR.grey600}
                size={36}
                percent={75}
                onPress={() => this.toggleLanguage(key)}
                disabled={
                  this.state.remainingLanguages === 0 &&
                  !this.state.selectedLanguages.includes(key)
                }
              />
          }
        />
      );
    };
    const hasChanged = Object.keys(this.state.selectedLanguages)
      .filter(key => !this.state.knownLanguages.includes(key))
      .length > 0;

    // Set up grammar rules for note and submit button
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const raceIndefiniteArticle = vowels
      .includes(this.state.race.name.charAt(0).toLowerCase()) ? 'an' : 'a';
    const backgroundIndefiniteArticle = vowels
      .includes(this.state.background.name.charAt(0).toLowerCase()) ?
      'an' : 'a';
    const racePlurality = this.state.race.additionalLanguages !== 1 ?
      'languages' : 'language';
    const backgroundPlurality =
      this.state.background.additionalLanguages !== 1 ?
        'languages' : 'language';
    const additionalPlurality = this.state.additionalLanguages !== 1 ?
      'languages' : 'language';
    const remainingPlurality = this.state.remainingLanguages !== 1 ?
      'Languages' : 'Language';

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20 }}>
            <Note
              title="Additional Languages"
              type="info"
              icon="info"
              collapsible
              isCollapsed={this.state.isNoteCollapsed}
              toggleNoteHandler={this.toggleLanguageNote}
              uiTheme={this.context.uiTheme}
            >
              <Text style={{ marginBottom: 10 }}>
                As {raceIndefiniteArticle}
                <Text style={CardStyle.makeBold}>
                  &nbsp;{this.state.race.name}
                </Text>
                , you can speak, read, and write in
                <Text style={CardStyle.makeBold}>
                  &nbsp;{toProperList(this.state.knownLanguages, 'and', true)}
                </Text>
                . You can learn
                {
                  this.state.race.additionalLanguages > 0 &&
                  <Text>
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.race.additionalLanguages}&nbsp;
                    </Text>
                    additional {racePlurality} as {raceIndefiniteArticle}
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.race.name}&nbsp;
                    </Text>
                    and
                  </Text>
                }
                {
                  this.state.background.additionalLanguages > 0 &&
                  <Text>
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.background.additionalLanguages}&nbsp;
                    </Text>
                    additional {backgroundPlurality} with&nbsp;
                    {backgroundIndefiniteArticle}
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.background.name}&nbsp;
                    </Text>
                    background
                  </Text>
                }
                {
                  (
                    (
                      this.state.race.additionalLanguages === 0 &&
                      this.state.background.additionalLanguages > 0
                    ) ||
                    (
                      this.state.race.additionalLanguages > 0 &&
                      this.state.background.additionalLanguages === 0
                    )
                  ) &&
                  '.'
                }
                {
                  this.state.race.additionalLanguages > 0 &&
                  this.state.background.additionalLanguages > 0 &&
                  <Text>
                    &nbsp;for
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.additionalLanguages}&nbsp;
                    </Text>
                    additional {additionalPlurality} in total.
                  </Text>
                }
                {
                  this.state.race.additionalLanguages === 0 &&
                  this.state.background.additionalLanguages === 0 &&
                  <Text>
                    <Text style={CardStyle.makeBold}>
                      &nbsp;0 additional languages&nbsp;
                    </Text>
                    as {raceIndefiniteArticle}
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.race.name}&nbsp;
                    </Text>
                    with {backgroundIndefiniteArticle}
                    <Text style={CardStyle.makeBold}>
                      &nbsp;{this.state.background.name}&nbsp;
                    </Text>
                    background.
                  </Text>
                }
              </Text>
            </Note>
            <View style={styles.buttonLayout}>
              {
                this.state.additionalLanguages > 0 &&
                <Button
                  accent
                  raised
                  disabled={!hasChanged}
                  onPress={() => this.resetLanguages()}
                  text="Reset"
                  style={{
                    container: {
                      flex: 1,
                      marginRight: 5,
                      marginTop: 10,
                      marginBottom: 20,
                    },
                  }}
                />
              }
              <Button
                primary
                raised
                disabled={this.state.remainingLanguages > 0}
                onPress={() => this.setLanguages()}
                text={
                  this.state.remainingLanguages > 0 ?
                    `${this.state.remainingLanguages} ${remainingPlurality} Remaining` :
                    'Proceed'
                }
                style={{
                  container: {
                    flex: 2,
                    marginLeft: 5,
                    marginTop: 10,
                    marginBottom: 20,
                  },
                }}
              />
            </View>
            <ListItem
              divider
              centerElement={
                <View style={styles.horizontalLayout}>
                  <Text style={[styles.smallHeading, textStyle]}>Language</Text>
                  <Text style={[styles.smallHeading, textStyle]}>Known</Text>
                </View>
              }
            />
            <ListItem
              divider
              style={{
                container: {
                  backgroundColor: COLOR.grey500,
                },
              }}
              centerElement={
                <View style={styles.horizontalLayout}>
                  <Text
                    style={[
                      styles.smallHeading,
                      CardStyle.makeBold,
                      { color: COLOR.white },
                    ]}
                  >
                    Standard Languages
                  </Text>
                </View>
              }
            />
            {
              this.state.allLanguages.standard
                .map(language => ListItemRow(language))
            }
            <ListItem
              divider
              style={{
                container: {
                  backgroundColor: COLOR.grey500,
                },
              }}
              centerElement={
                <View style={styles.horizontalLayout}>
                  <Text
                    style={[
                      styles.smallHeading,
                      CardStyle.makeBold,
                      { color: COLOR.white },
                    ]}
                  >
                    Exotic Languages
                  </Text>
                </View>
              }
            />
            {
              this.state.allLanguages.exotic
                .map(language => ListItemRow(language))
            }
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
  additionalInfo: {
    fontFamily: 'RobotoLight',
    color: COLOR.black,
    fontSize: 14,
    padding: 10,
  },
  buttonLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
