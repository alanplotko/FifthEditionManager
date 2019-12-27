import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, COLOR, Icon, Toolbar, withTheme } from 'react-native-material-ui';
import { BACKGROUNDS } from 'FifthEditionManager/config/Info';
import { toTitleCase, toProperList } from 'FifthEditionManager/util';
import { CardStyle, ContainerStyle, FormStyle, LayoutStyle } from 'FifthEditionManager/stylesheets';
import OGLButton from 'FifthEditionManager/components/OGLButton';
import Note from 'FifthEditionManager/components/Note';
import { cloneDeep, throttle } from 'lodash';

const t = require('tcomb-form-native');
const Chance = require('chance');

const chance = new Chance();

/**
 * Character background selection
 */

const backgrounds = BACKGROUNDS.map(background => ({ key: background.key, name: background.name }));
const BackgroundType = backgrounds.reduce((o, background) =>
  Object.assign(o, { [background.key]: background.name }), {});
const BackgroundForm = t.struct({ background: t.enums(BackgroundType) });

/**
 * Form stylesheet setup
 */

const stylesheet = cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup.normal.flexDirection = 'row';
stylesheet.formGroup.error.flexDirection = 'row';
stylesheet.formGroup.normal.alignItems = 'center';
stylesheet.formGroup.error.alignItems = 'center';
stylesheet.select.normal.flex = 1;
stylesheet.select.error.flex = 1;
stylesheet.select.normal.marginLeft = 10;
stylesheet.select.error.marginLeft = 10;

class CharacterBackground extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      background: null,
      decisions: [],
      selectedDecisions: [],
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ randomizeBackground: this.randomizeBackground });
  }

  onPress = () => {
    if (this.state.background) {
      const { navigate, state } = this.props.navigation;
      const newCharacter = cloneDeep(state.params.character);
      newCharacter.meta.lastUpdated = Date.now();
      newCharacter.background = {
        lookupKey: this.state.background.key,
        name: this.state.background.name,
      };

      // Set up starting inventory
      const inventory = {};
      this.state.background.starting.equipment.forEach((item) => {
        inventory[item.name] = item;
      });

      if (this.state.selectedDecisions.length > 0) {
        this.state.selectedDecisions.forEach((decision, index) => {
          const item = this.state.background.starting.decisions[index]
            .find(itm => itm.name === decision);
          // Ignore duplicate item if quantity is not tracked; otherwise, increase quantity by 1
          if (inventory[item.name] && inventory[item.name].quantity) {
            inventory[item.name].quantity += 1;
          } else {
            inventory[item.name] = item;
          }
        });
      }
      newCharacter.equipment = Object.values(inventory);
      newCharacter.money = Object.assign(
        {
          cp: 0, sp: 0, ep: 0, gp: 0, pp: 0,
        },
        this.state.background.starting.money,
      );
      navigate('SetUpProfile', { character: newCharacter });
    }
  }

  onChangeBackground = (value) => {
    if (value) {
      if (this.state.background && value.background === this.state.background.key) {
        return;
      }
      const background = BACKGROUNDS.find(item => item.key === value.background) || null;
      const decisions = background ? background.starting.decisions : [];
      this.setState({
        background,
        decisions,
        selectedDecisions: Array(decisions.length).fill(null),
      });
    }
  }

  onChangeDecision = (value) => {
    if (value) {
      const selectedDecisions = this.state.selectedDecisions.slice(0);
      if (selectedDecisions[value.index] === value.decision) {
        return;
      }
      selectedDecisions[value.index] = value.decision;
      this.setState({ selectedDecisions });
    }
  }

  getDecisionForm = (decision) => {
    const DecisionType = decision
      .map(item => item.name)
      .reduce((o, name) => Object.assign(o, { [name]: name }), {});
    return t.struct({
      decision: t.enums(DecisionType),
      index: t.Number,
    });
  }

  getDecisionFormOptions = decisionNumber => ({
    template: locals => (
      <View
        style={[
          LayoutStyle.centered,
          {
            borderWidth: 2,
            borderColor: COLOR.grey800,
            paddingTop: 30,
            marginBottom: 20,
          },
        ]}
      >
        <Text style={FormStyle.label}>Decision #{decisionNumber}</Text>
        <View
          style={{
            flex: 1, margin: 0, padding: 0, height: 50,
          }}
        >
          {locals.inputs.decision}
        </View>
      </View>
    ),
    stylesheet,
    fields: {
      decision: {
        auto: 'none',
        nullOption: {
          value: null,
          text: 'Confirm Decision',
        },
      },
    },
  });

  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(routes[index].key),
        centerElement: 'Character Background',
        rightElement: 'autorenew',
        onRightElementPress: throttle(() => routes[index].params.randomizeBackground(), 500),
      };
      return <Toolbar {...props} />;
    },
  }

  backgroundFormOptions = {
    template: (locals) => {
      const { race } = this.props.navigation.state.params.character;
      return (
        <View
          style={[
            LayoutStyle.centered,
            {
              borderWidth: 2,
              borderColor: COLOR.grey800,
              paddingTop: 30,
              marginBottom: 20,
            },
          ]}
        >
          <Text style={FormStyle.label}>Your {race.name}&apos;s Background</Text>
          <View
            style={{
              flex: 1, margin: 0, padding: 0, height: 50,
            }}
          >
            {locals.inputs.background}
          </View>
        </View>
      );
    },
    stylesheet,
    fields: {
      background: {
        auto: 'none',
        nullOption: { value: '', text: 'Select Background' },
      },
    },
  }

  randomizeBackground = () => {
    /*
      Allow reselecting the same background, given that the default selection
      consists of only 1 background and randomization can be done at the
      decision level too.
    */
    const background = chance.pickone(BACKGROUNDS);
    const decisions = background ? background.starting.decisions : [];
    const selectedDecisions = [];
    if (decisions.length > 0) {
      decisions.forEach((decision) => {
        selectedDecisions.push(chance.pickone(decision).name);
      });
    }
    this.setState({
      background,
      decisions,
      selectedDecisions,
    });
  }

  render() {
    // Theme setup
    const { backdropIconColor, fadedTextColor } = this.props.theme.palette;
    const fadedTextStyle = { color: fadedTextColor };
    const decisionPlurality = this.state.decisions.length -
      this.state.selectedDecisions.filter(item => item !== null).length > 1 ?
      'Decisions' :
      'Decision';

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={ContainerStyle.padded}>
            <Note
              title="Choosing a Background"
              type="tip"
              icon="lightbulb-outline"
            >
              <Text>
                The background you choose will become your character&apos;s back-story, explaining
                how they became who they are today.
              </Text>
            </Note>
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={BackgroundForm}
              value={{ background: this.state.background?.key }}
              options={this.backgroundFormOptions}
              onChange={value => this.onChangeBackground(value)}
            />
            {
              this.state.decisions.length > 0 &&
              this.state.decisions.map((decision, index) => (
                <t.form.Form
                  key={`decision-${index}`} // eslint-disable-line react/no-array-index-key
                  type={this.getDecisionForm(decision)}
                  options={this.getDecisionFormOptions(index + 1)}
                  value={{ decision: this.state.selectedDecisions[index], index }}
                  onChange={value => this.onChangeDecision(value)}
                />
              ))
            }
            <Button
              primary
              raised
              disabled={
                !this.state.background ||
                this.state.decisions.length !== this.state.selectedDecisions.length ||
                this.state.selectedDecisions.some(item => item === null)
              }
              onPress={this.onPress}
              text={
                this.state.selectedDecisions.some(item => item === null) ?
                  `${this.state.selectedDecisions.filter(item => item === null).length} ${decisionPlurality} Remaining` :
                  'Proceed'
              }
              style={{ container: { marginBottom: 10 } }}
            />
            {
              this.state.background && [
                <Card
                  key={`${this.state.background.key}-background`}
                  style={{ container: CardStyle.container }}
                >
                  <Text style={CardStyle.cardHeading}>{this.state.background.name}</Text>
                  <Text style={CardStyle.cardText}>{this.state.background.description}{'\n'}</Text>
                  <Text style={[CardStyle.cardText, CardStyle.extraPadding]}>
                    You can learn&nbsp;
                    <Text style={CardStyle.makeBold}>
                      {this.state.background.additionalLanguages}&nbsp;
                    </Text>
                    additional&nbsp;
                    {this.state.background.additionalLanguages !== 1 ? 'languages' : 'language'}
                    .
                  </Text>
                  <OGLButton sourceText="Source: 5th Edition SRD" />
                </Card>,
                <Card
                  key={`${this.state.background.key}-equipment`}
                  style={{ container: CardStyle.container }}
                >
                  <Text style={CardStyle.cardHeading}>Starting Equipment</Text>
                  {
                    this.state.background.starting.decisions &&
                    this.state.background.starting.decisions.length === 0 &&
                    this.state.background.starting.equipment &&
                    this.state.background.starting.equipment.length === 0 &&
                    !this.state.background.starting.money &&
                    <Text style={[CardStyle.cardText, CardStyle.extraPadding]}>
                      No starting equipment.
                    </Text>
                  }
                  <Text style={[CardStyle.cardText, CardStyle.extraPadding]}>
                    {
                      this.state.background.starting.equipment.length > 0 &&
                      this.state.background.starting.equipment.map(item => (
                        <Text key={`${item.name}`}>
                          <Text>
                            &bull;&nbsp;<Text style={CardStyle.makeBold}>{item.name}</Text>
                            {
                              item.quantity &&
                              <Text style={CardStyle.makeItalic}>
                                &nbsp;({item.quantity}
                                {
                                  item.unit &&
                                  <Text>
                                    &nbsp;
                                    {item.quantity > 1 ? item.unit.plural : item.unit.singular}
                                  </Text>
                                }
                                &nbsp;in inventory)
                              </Text>
                            }
                          </Text>
                          {
                            item.description &&
                            <Text>: {item.description}</Text>
                          }
                          {'\n\n'}
                        </Text>
                      ))
                    }
                    {
                      this.state.background.starting.money &&
                      <Text style={CardStyle.extraPadding}>
                        &bull;&nbsp;
                        <Text style={CardStyle.makeBold}>Starting money&nbsp;</Text>
                        <Text style={CardStyle.makeItalic}>
                          ({
                            toProperList(
                              Object.keys(this.state.background.starting.money)
                                .map(ccy => `${this.state.background.starting.money[ccy]} ${ccy}`),
                              'and',
                              false,
                            )
                          }&nbsp;on hand)
                        </Text>
                        {'\n\n'}
                      </Text>
                    }
                    {
                      this.state.background.starting.decisions &&
                      this.state.background.starting.decisions.length > 0 &&
                      this.state.background.starting.decisions.map((items, decisionIndex) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Text key={`${decisionIndex}`}>
                          &bull;&nbsp;
                          <Text style={CardStyle.makeBold}>
                            Decision #{decisionIndex + 1}:&nbsp;
                          </Text>
                          1 of&nbsp;
                          {
                            toProperList(items.map(item => item.name), 'or', false)
                          }
                        </Text>
                      ))
                    }
                  </Text>
                  <OGLButton sourceText="Source: 5th Edition SRD" />
                </Card>,
                <Card
                  key={`${this.state.background.key}-proficiencies`}
                  style={{ container: CardStyle.container }}
                >
                  <Text style={CardStyle.cardHeading}>Proficiencies</Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Skills:&nbsp;</Text>
                    {this.state.background.proficiencies.skills.length === 0 && 'None'}
                    {
                      this.state.background.proficiencies.skills.length > 0 &&
                      toTitleCase(this.state.background.proficiencies.skills.join(', '))
                    }
                  </Text>
                  <Text style={[CardStyle.cardText, CardStyle.extraPadding]}>
                    <Text style={CardStyle.makeBold}>Tools:&nbsp;</Text>
                    {this.state.background.proficiencies.tools.length === 0 && 'None'}
                    {
                      this.state.background.proficiencies.tools.length > 0 &&
                      this.state.background.proficiencies.tools
                        .map((tool) => {
                          if (tool.name) {
                            return toTitleCase(tool.name);
                          } else if (tool.options) {
                            const toolOptions = [];
                            tool.options.forEach((opt) => {
                              toolOptions.push(`${opt.quantity} of ${toTitleCase(opt.tag)}`);
                            });
                            return toolOptions.join(' or ');
                          } else if (tool.tag) {
                            return `${tool.quantity} of ${toTitleCase(tool.tag)}`;
                          }
                          return '[Unknown Name]';
                        })
                        .join(', ')
                    }
                  </Text>
                  <OGLButton sourceText="Source: 5th Edition SRD" />
                </Card>,
              ]}
            {
              !this.state.background &&
              <Card style={{ container: { padding: 20 } }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="info"
                    style={{
                      color: backdropIconColor,
                      fontSize: 48,
                      width: 48,
                      height: 48,
                      marginRight: 10,
                    }}
                  />
                  <Text style={[styles.placeholderMessage, fadedTextStyle]}>
                    Selection details will display here
                  </Text>
                </View>
              </Card>
            }
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  placeholderMessage: {
    fontFamily: 'RobotoLight',
    color: COLOR.grey700,
    fontSize: 18,
  },
});

export default withTheme(CharacterBackground);
