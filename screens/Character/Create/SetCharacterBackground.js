import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, COLOR, Icon, Toolbar, ListItem }
  from 'react-native-material-ui';
import { BACKGROUNDS } from 'DNDManager/config/Info';
import { toProperList, toTitleCase } from 'DNDManager/util';
import ContainerStyle from 'DNDManager/stylesheets/ContainerStyle';
import { cloneDeep } from 'lodash';

const t = require('tcomb-form-native');
const Chance = require('chance');

const chance = new Chance();

/**
 * Character background selection
 */

const backgrounds = BACKGROUNDS.map((background) => ({
  key: background.key,
  name: background.name,
}));
const BackgroundType = backgrounds.reduce((o, background) =>
  Object.assign(o, { [background.key]: background.name }), {});
const CharacterBackground = t.struct({
  background: t.enums(BackgroundType),
});

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

export default class SetCharacterBackground extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Character Background',
        rightElement: 'autorenew',
        onRightElementPress: () => routes[index].params.randomizeBackground(),
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
      background: null,
      form: null,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      randomizeBackground: this.randomizeBackground,
    });
  }

  formOptions = {
    template: (locals) => {
      const { race } = this.props.navigation.state.params.character.profile;
      return (
        <View
          style={[
            styles.centered,
            {
              borderWidth: 2,
              borderColor: 'rgba(0, 0, 0, 0.7)',
              paddingTop: 30,
            },
          ]}
        >
          <Text style={styles.label}>Your {race.name}'s Background</Text>
          <View style={{ flex: 1, margin: 0, padding: 0, height: 50 }}>
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

  onPress = () => {
    const background = this.form.getValue();
    if (background) {
      const { navigate, state } = this.props.navigation;
      const newCharacter = Object.assign({}, state.params.character);
      newCharacter.lastUpdated = Date.now();
      newCharacter.profile = Object.assign({}, newCharacter.profile, {
        background: {
          lookupKey: this.state.background.key,
          name: this.state.background.name,
        },
      });
      console.log(newCharacter);
      navigate('ChooseScoringMethod', { character: newCharacter });
    }
  }

  onChange = (value) => {
    this.setState({
      form: value,
      background:
        BACKGROUNDS.find(background => background.key === value.background),
    });
  }

  randomizeBackground = () => {
    const background = chance.pickone(BACKGROUNDS);
    this.setState({
      background,
      form: { background: background.key },
    });
  }

  render() {
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
            <View style={styles.centered}>
              <t.form.Form
                ref={(c) => { this.form = c; }}
                type={CharacterBackground}
                value={this.state.form}
                options={this.formOptions}
                onChange={this.onChange}
              />
            </View>
            <View style={[styles.centered, { marginVertical: 20 }]}>
              <Button
                primary
                raised
                disabled={!this.state.background}
                onPress={this.onPress}
                text="Proceed"
                style={{ container: { flex: 1 } }}
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              {
                this.state.background && [
                <Card
                  key={`${this.state.background.name}Background`}
                  style={{ container: { padding: 15, width: '100%' } }}
                >
                  <Text style={styles.cardHeading}>
                    {this.state.background.name}
                  </Text>
                  <Text style={styles.cardText}>
                    {this.state.background.description}{'\n'}
                  </Text>
                  <Text style={styles.cardText}>
                    You can learn&nbsp;
                    <Text style={styles.makeBold}>
                      {this.state.background.additionalLanguages}&nbsp;
                    </Text>
                    additional&nbsp;
                    {
                      this.state.background.additionalLanguages !== 1 ?
                        'languages' : 'language'
                    }
                    .
                  </Text>
                </Card>,
                <Card
                  key={`${this.state.background.name}Equipment`}
                  style={{ container: { padding: 15, width: '100%' } }}
                >
                  <Text style={styles.cardHeading}>
                    Starting Equipment
                  </Text>
                  <Text style={styles.cardText}>
                    {this.state.background.equipment}
                  </Text>
                </Card>,
                <Card
                  key={`${this.state.background.name}Proficiencies`}
                  style={{ container: { padding: 15, width: '100%' } }}
                >
                  <Text style={styles.cardHeading}>
                    Proficiencies
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.makeBold}>Skills:&nbsp;</Text>
                    {
                      this.state.background.proficiencies.skills.length === 0 &&
                      'None'
                    }
                    {
                      this.state.background.proficiencies.skills.length > 0 &&
                      toTitleCase(
                        this.state.background.proficiencies.skills.join(', '),
                      )
                    }
                    .
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.makeBold}>Tools:&nbsp;</Text>
                    {
                      this.state.background.proficiencies.tools.length === 0 &&
                      'None'
                    }
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
                          return '';
                        })
                        .join(', ')
                    }
                    .
                  </Text>
                </Card>
              ]}
              {
                !this.state.background &&
                <Card style={{ container: { padding: 20 } }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      name="info"
                      style={{
                        color: '#ccc',
                        fontSize: 48,
                        width: 48,
                        height: 48,
                        marginRight: 10,
                      }} />
                    <Text style={styles.placeholderMessage}>
                      Selection details will display here
                    </Text>
                  </View>
                </Card>
              }
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardHeading: {
    fontFamily: 'RobotoLight',
    color: '#000',
    fontSize: 24,
    marginBottom: 5,
  },
  cardNote: {
    fontFamily: 'Roboto',
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  cardText: {
    fontFamily: 'Roboto',
    color: '#666',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  makeBold: {
    fontFamily: 'RobotoBold',
  },
  label: {
    position: 'absolute',
    top: 0,
    width: '100%',
    fontFamily: 'RobotoBold',
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 5,
    paddingHorizontal: 18,
  },
  placeholderMessage: {
    fontFamily: 'RobotoLight',
    color: '#666',
    fontSize: 18,
  },
});
