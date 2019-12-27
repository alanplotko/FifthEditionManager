import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, COLOR, Icon, Toolbar, withTheme } from 'react-native-material-ui';
import { CLASSES, IMAGES } from 'FifthEditionManager/config/Info';
import { toProperList, toTitleCase } from 'FifthEditionManager/util';
import { CardStyle, ContainerStyle, FormStyle, LayoutStyle } from 'FifthEditionManager/stylesheets';
import OGLButton from 'FifthEditionManager/components/OGLButton';
import Note from 'FifthEditionManager/components/Note';
import { cloneDeep, throttle } from 'lodash';

const t = require('tcomb-form-native');
const Chance = require('chance');

const chance = new Chance();

/**
 * Character class selection
 */

const BaseClassType = Object
  .keys(CLASSES)
  .map(key => ({ key, name: CLASSES[key].name }))
  .reduce((o, cls) => Object.assign(o, { [cls.key]: cls.name }), {});
const BaseClassForm = t.struct({ baseClass: t.enums(BaseClassType) });

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

class CharacterBaseClass extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      baseClass: null,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ randomizeClass: this.randomizeClass });
  }

  onPress = () => {
    if (this.state.baseClass) {
      const { navigate, state } = this.props.navigation;
      const newCharacter = cloneDeep(state.params.character);
      newCharacter.meta.lastUpdated = Date.now();
      newCharacter.baseClass = {
        lookupKey: this.state.baseClass,
        name: CLASSES[this.state.baseClass].name,
      };
      navigate('SetCharacterBackground', { character: newCharacter });
    }
  }

  onChange = (value) => {
    if (value && value.baseClass !== this.state.baseClass) {
      this.setState({ baseClass: value.baseClass });
    }
  }

  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(routes[index].key),
        centerElement: 'Character Class',
        rightElement: 'autorenew',
        onRightElementPress: throttle(() => routes[index].params.randomizeClass(), 500),
      };
      return <Toolbar {...props} />;
    },
  }

  formOptions = {
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
          <Text style={FormStyle.label}>Your {race.name}&apos;s Class</Text>
          <View
            style={{
              flex: 1, margin: 0, padding: 0, height: 50,
            }}
          >
            {locals.inputs.baseClass}
          </View>
        </View>
      );
    },
    stylesheet,
    fields: {
      baseClass: {
        auto: 'none',
        nullOption: { value: null, text: 'Select Class' },
      },
    },
  }

  randomizeClass = () => {
    // Do not reselect current option
    const baseClass = chance.pickone(Object.keys(CLASSES)
      .filter(cls => cls !== this.state.baseClass));
    this.setState({ baseClass });
  }

  render() {
    // Theme setup
    const { backdropIconColor, fadedTextColor } = this.props.theme.palette;
    const fadedTextStyle = { color: fadedTextColor };
    const clsDetails = this.state.baseClass ? CLASSES[this.state.baseClass] : null;

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={ContainerStyle.padded}>
            <Note
              title="Choosing a Class"
              type="tip"
              icon="lightbulb-outline"
            >
              <Text>
                The class you choose will define your character&apos;s profession and lifestyle.
              </Text>
            </Note>
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={BaseClassForm}
              value={{ baseClass: this.state.baseClass }}
              options={this.formOptions}
              onChange={this.onChange}
            />
            <Button
              primary
              raised
              disabled={!this.state.baseClass}
              onPress={this.onPress}
              text="Proceed"
              style={{ container: { marginBottom: 10 } }}
            />
            {
              clsDetails && [
                <Card
                  key={`${clsDetails.key}-class`}
                  style={{ container: CardStyle.container }}
                >
                  <View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 36,
                        marginBottom: 15,
                      }}
                    >
                      <Image
                        source={IMAGES.BASE_CLASS.ICON[this.state.baseClass]}
                        style={{ width: 36, height: 36, marginRight: 10 }}
                      />
                      <Text style={[CardStyle.cardHeading, { paddingTop: 6 }]}>
                        {clsDetails.name}
                      </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 2 }}>
                        <Text style={CardStyle.cardText}>
                          {clsDetails.description}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Image
                          source={IMAGES.BASE_CLASS.BACKDROP[this.state.baseClass]}
                          style={{ height: 128, width: null }}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  </View>
                </Card>,
                <Card
                  key={`${clsDetails.key}-hit-die`}
                  style={{ container: CardStyle.container }}
                >
                  <Text style={CardStyle.cardHeading}>Hit Die</Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>{clsDetails.name}s&nbsp;</Text>
                    gain&nbsp;
                    <Text style={CardStyle.makeBold}>1d{clsDetails.hitDie}&nbsp;</Text>
                    per level.
                  </Text>
                  <Text style={CardStyle.cardText}>
                    At the 1st level, you start with:{'\n'}
                    <Text style={CardStyle.makeBold}>
                      {clsDetails.hitDie} + your Constitution modifier
                    </Text>
                    .
                  </Text>
                  <Text style={[CardStyle.cardText, CardStyle.extraPadding]}>
                    At higher levels (after level 1), you gain:{'\n'}
                    <Text style={CardStyle.makeBold}>
                      {clsDetails.hitDie} (or {(clsDetails.hitDie / 2) + 1})
                      + your Constitution modifier
                    </Text>
                    .
                  </Text>
                  <OGLButton sourceText="Source: 5th Edition SRD" />
                </Card>,
                <Card
                  key={`${clsDetails.key}-proficiencies`}
                  style={{ container: CardStyle.container }}
                >
                  <Text style={CardStyle.cardHeading}>Proficiencies</Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Saving Throws:&nbsp;</Text>
                    {clsDetails.proficiencies.savingThrows.length === 0 && 'None'}
                    {
                      clsDetails.proficiencies.savingThrows.length > 0 &&
                      toTitleCase(clsDetails.proficiencies.savingThrows.join(', '))
                    }
                    .
                  </Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Armor:&nbsp;</Text>
                    {clsDetails.proficiencies.armor.length === 0 && 'None'}
                    {
                      clsDetails.proficiencies.armor.length > 0 &&
                      toTitleCase(clsDetails.proficiencies.armor.join(', '))
                    }
                    .
                  </Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Weapons:&nbsp;</Text>
                    {clsDetails.proficiencies.weapons.length === 0 && 'None'}
                    {
                      clsDetails.proficiencies.weapons.length > 0 &&
                      toTitleCase(CLASSES[this.state.baseClass].proficiencies.weapons.join(', '))
                    }
                    .
                  </Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Tools:&nbsp;</Text>
                    {clsDetails.proficiencies.tools.length === 0 && 'None'}
                    {
                      clsDetails.proficiencies.tools.length > 0 &&
                      clsDetails.proficiencies.tools
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
                    .
                  </Text>
                  <Text style={[CardStyle.cardText, CardStyle.extraPadding]}>
                    <Text style={CardStyle.makeBold}>Skills:&nbsp;</Text>
                    {
                      !clsDetails.proficiencies.skills.options &&
                      `${clsDetails.proficiencies.skills.quantity} of Any Skill`
                    }
                    {
                      clsDetails.proficiencies.skills.options &&
                      clsDetails.proficiencies.skills.options.length === 0 &&
                      'None'
                    }
                    {
                      clsDetails.proficiencies.skills.options &&
                      clsDetails.proficiencies.skills.options.length > 0 &&
                      `${clsDetails.proficiencies.skills.quantity} from ${toProperList(clsDetails.proficiencies.skills.options, 'and', true)}`
                    }
                    .
                  </Text>
                  <OGLButton sourceText="Source: 5th Edition SRD" />
                </Card>,
              ]
            }
            {
              !this.state.baseClass &&
              <Card style={{ container: CardStyle.container }}>
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

export default withTheme(CharacterBaseClass);
