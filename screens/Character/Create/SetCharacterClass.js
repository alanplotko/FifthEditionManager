import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, Icon, Toolbar } from 'react-native-material-ui';
import { CLASSES, IMAGES } from 'FifthEditionManager/config/Info';
import { toProperList, toTitleCase } from 'FifthEditionManager/util';
import { CardStyle, ContainerStyle, FormStyle, LayoutStyle } from 'FifthEditionManager/stylesheets';
import OGLButton from 'FifthEditionManager/components/OGLButton';
import { cloneDeep } from 'lodash';

const t = require('tcomb-form-native');
const Chance = require('chance');

const chance = new Chance();

/**
 * Character class selection
 */

const baseClasses = CLASSES.map(baseClass => ({ key: baseClass.key, name: baseClass.name }));
const BaseClassType = baseClasses.reduce((o, baseClass) =>
  Object.assign(o, { [baseClass.key]: baseClass.name }), {});
const CharacterBaseClass = t.struct({ baseClass: t.enums(BaseClassType) });

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

export default class SetCharacterClass extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Character Class',
        rightElement: 'autorenew',
        onRightElementPress: () => routes[index].params.randomizeClass(),
      };
      return <Toolbar {...props} />;
    },
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      baseClass: null,
      form: null,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ randomizeClass: this.randomizeClass });
  }

  onPress = () => {
    if (this.state.baseClass) {
      const { navigate, state } = this.props.navigation;
      const newCharacter = Object.assign({}, state.params.character);
      newCharacter.lastUpdated = Date.now();
      newCharacter.profile = Object.assign({}, newCharacter.profile, {
        baseClass: {
          lookupKey: this.state.baseClass.key,
          name: this.state.baseClass.name,
        },
      });
      navigate('SetCharacterBackground', { character: newCharacter });
    }
  }

  onChange = (value) => {
    this.setState({
      form: value,
      baseClass: CLASSES.find(baseClass => baseClass.key === value.baseClass),
    });
  }

  formOptions = {
    template: (locals) => {
      const { race } = this.props.navigation.state.params.character.profile;
      return (
        <View
          style={[
            LayoutStyle.centered,
            { borderWidth: 2, borderColor: 'rgba(0, 0, 0, 0.7)', paddingTop: 30 },
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
        nullOption: { value: '', text: 'Select Class' },
      },
    },
  }

  randomizeClass = () => {
    const baseClass = chance.pickone(CLASSES);
    this.setState({ baseClass, form: { baseClass: baseClass.key } });
  }

  render() {
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20, alignItems: 'center' }}>
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={CharacterBaseClass}
              value={this.state.form}
              options={this.formOptions}
              onChange={this.onChange}
            />
            <Button
              primary
              raised
              disabled={!this.state.baseClass}
              onPress={this.onPress}
              text="Proceed"
              style={{ container: { width: '100%', marginVertical: 20 } }}
            />
            {
              this.state.baseClass && [
                <Card
                  key={`${this.state.baseClass.name}Class`}
                  style={{ container: CardStyle.container }}
                >
                  <View style={LayoutStyle.centered}>
                    <View style={{ flex: 2 }}>
                      <Text style={CardStyle.cardHeading}>
                        {this.state.baseClass.name}
                      </Text>
                      <Text style={CardStyle.cardText}>
                        {this.state.baseClass.description}{'\n'}
                      </Text>
                    </View>
                      {/* <View style={{ flex: 1 }}>
                        <Image
                          source={IMAGES.BASE_CLASS[this.state.baseClass.key]}
                          style={{
                            flex: 1, width: null, height: '100%',
                          }}
                          resizeMode="contain"
                        />
                      </View> */}
                  </View>
                </Card>,
                <Card
                  key={`${this.state.baseClass.name}Proficiencies`}
                  style={{ container: CardStyle.container }}
                >
                  <Text style={CardStyle.cardHeading}>Additional Information</Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Hit Die:&nbsp;</Text>
                    d{this.state.baseClass.hitDie}
                  </Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Saving Throws:&nbsp;</Text>
                    {this.state.baseClass.proficiencies.savingThrows.length === 0 && 'None'}
                    {
                      this.state.baseClass.proficiencies.savingThrows.length > 0 &&
                      toTitleCase(this.state.baseClass.proficiencies.savingThrows.join(', '))
                    }
                    .
                  </Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Armor:&nbsp;</Text>
                    {this.state.baseClass.proficiencies.armor.length === 0 && 'None'}
                    {
                      this.state.baseClass.proficiencies.armor.length > 0 &&
                      toTitleCase(this.state.baseClass.proficiencies.armor.join(', '))
                    }
                    .
                  </Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Weapons:&nbsp;</Text>
                    {this.state.baseClass.proficiencies.weapons.length === 0 && 'None'}
                    {
                      this.state.baseClass.proficiencies.weapons.length > 0 &&
                      toTitleCase(this.state.baseClass.proficiencies.weapons.join(', '))
                    }
                    .
                  </Text>
                  <Text style={CardStyle.cardText}>
                    <Text style={CardStyle.makeBold}>Tools:&nbsp;</Text>
                    {this.state.baseClass.proficiencies.tools.length === 0 && 'None'}
                    {
                      this.state.baseClass.proficiencies.tools.length > 0 &&
                      this.state.baseClass.proficiencies.tools
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
                          return '';
                        })
                        .join(', ')
                    }
                    .
                  </Text>
                  <Text style={[CardStyle.cardText, CardStyle.extraPadding]}>
                    <Text style={CardStyle.makeBold}>Skills:&nbsp;</Text>
                    {
                      !this.state.baseClass.proficiencies.skills.options &&
                      `${this.state.baseClass.proficiencies.skills.quantity} of Any Skill`
                    }
                    {
                      this.state.baseClass.proficiencies.skills.options &&
                      this.state.baseClass.proficiencies.skills.options.length === 0 &&
                      'None'
                    }
                    {
                      this.state.baseClass.proficiencies.skills.options &&
                      this.state.baseClass.proficiencies.skills.options.length > 0 &&
                      `${this.state.baseClass.proficiencies.skills.quantity} from ${toProperList(this.state.baseClass.proficiencies.skills.options, 'and', true)}`
                    }
                    .
                  </Text>
                  <OGLButton sourceText="Source: 5th Edition SRD" />
                </Card>,
              ]
            }
            {
              !this.state.baseClass &&
              <Card style={{ container: { padding: 20 } }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="info"
                    style={{
                      color: '#ccc', fontSize: 48, width: 48, height: 48, marginRight: 10,
                    }}
                  />
                  <Text style={styles.placeholderMessage}>Selection details will display here</Text>
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
    color: '#666',
    fontSize: 18,
  },
});
