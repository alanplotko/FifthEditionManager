import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, Icon, Toolbar } from 'react-native-material-ui';
import { BACKGROUNDS } from 'DNDManager/config/Info';
import { toTitleCase } from 'DNDManager/util';
import { CardStyle, ContainerStyle, FormStyle, LayoutStyle }
  from 'DNDManager/stylesheets';
import { cloneDeep } from 'lodash';

const t = require('tcomb-form-native');
const Chance = require('chance');

const chance = new Chance();

/**
 * Character background selection
 */

const backgrounds = BACKGROUNDS.map(background => ({ key: background.key, name: background.name }));
const BackgroundType = backgrounds.reduce((o, background) =>
  Object.assign(o, { [background.key]: background.name }), {});
const CharacterBackground = t.struct({ background: t.enums(BackgroundType) });

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
    this.props.navigation.setParams({ randomizeBackground: this.randomizeBackground });
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
      navigate('ChooseScoringMethod', { character: newCharacter });
    }
  }

  onChange = (value) => {
    this.setState({
      form: value,
      background: BACKGROUNDS.find(background => background.key === value.background),
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
    const background = chance.pickone(BACKGROUNDS);
    this.setState({ background, form: { background: background.key } });
  }

  render() {
    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={{ margin: 20, alignItems: 'center' }}>
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={CharacterBackground}
              value={this.state.form}
              options={this.formOptions}
              onChange={this.onChange}
            />
            <Button
              primary
              raised
              disabled={!this.state.background}
              onPress={this.onPress}
              text="Proceed"
              style={{ container: { width: '100%', marginVertical: 20 } }}
            />
            {
              this.state.background && [
                <Card
                  key={`${this.state.background.name}Background`}
                  style={{ container: CardStyle.container }}
                >
                  <Text style={CardStyle.cardHeading}>{this.state.background.name}</Text>
                  <Text style={CardStyle.cardText}>{this.state.background.description}{'\n'}</Text>
                  <Text style={CardStyle.cardText}>
                    You can learn&nbsp;
                    <Text style={CardStyle.makeBold}>
                      {this.state.background.additionalLanguages}&nbsp;
                    </Text>
                    additional&nbsp;
                    {this.state.background.additionalLanguages !== 1 ? 'languages' : 'language'}
                    .
                  </Text>
                </Card>,
                <Card
                  key={`${this.state.background.name}Equipment`}
                  style={{ container: CardStyle.container }}
                >
                  <Text style={CardStyle.cardHeading}>Starting Equipment</Text>
                  <Text style={CardStyle.cardText}>{this.state.background.equipment}</Text>
                </Card>,
                <Card
                  key={`${this.state.background.name}Proficiencies`}
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
                    .
                  </Text>
                  <Text style={CardStyle.cardText}>
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
                          return '';
                        })
                        .join(', ')
                    }
                    .
                  </Text>
                </Card>,
              ]}
            {
              !this.state.background &&
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
