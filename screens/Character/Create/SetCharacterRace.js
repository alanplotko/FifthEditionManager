import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, View, Text, Image } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, COLOR, Icon, Toolbar } from 'react-native-material-ui';
import { RACES } from 'FifthEditionManager/config/Info';
import { CardStyle, ContainerStyle, LayoutStyle } from 'FifthEditionManager/stylesheets';
import OGLButton from 'FifthEditionManager/components/OGLButton';

const uuidv4 = require('uuid/v4');
const Chance = require('chance');

const chance = new Chance();

// 15 margin = (5 margin * 2 sides) + 5 spacing per avatar
const AVATAR_MARGIN = 15;
// 35 = race name text height (25) + bottom padding (10) (estimation)
const TEXT_HEIGHT = 35;

export default class SetCharacterRace extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Character Race',
        rightElement: 'autorenew',
        onRightElementPress: () => routes[index].params.randomizeRace(),
      };
      return <Toolbar {...props} />;
    },
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static contextTypes = {
    uiTheme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      race: null,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
  }

  componentWillMount() {
    Dimensions.addEventListener('change', this.orientationHandler);
  }

  componentDidMount() {
    this.props.navigation.setParams({ randomizeRace: this.randomizeRace });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.orientationHandler);
  }

  onPress = () => {
    if (this.state.race) {
      const { navigate } = this.props.navigation;
      const timestamp = Date.now();
      const profile = Object.assign({}, {
        race: {
          lookupKey: this.state.race.key,
          name: this.state.race.name,
        },
      });

      // Set up new character object
      const newCharacter = {
        key: uuidv4(),
        profile,
        created: timestamp,
        lastUpdated: timestamp,
      };

      navigate('SetCharacterClass', { character: newCharacter });
    }
  }

  setRace = (key) => {
    this.setState({
      race: this.state.race && this.state.race.key === key ? null :
        RACES.find(race => race.key === key),
    });
  }

  orientationHandler = dims =>
    this.setState({ width: dims.window.width, height: dims.window.height });

  randomizeRace = () => {
    this.setState({ race: chance.pickone(RACES) });
  }

  render() {
    // Theme setup
    const {
      backdropIconColor,
      fadedTextColor,
      fadedBackgroundColor,
    } = this.context.uiTheme.palette;
    const fadedTextStyle = { color: fadedTextColor };
    const fadedBackgroundStyle = { backgroundColor: fadedBackgroundColor };

    const avatarCount = this.state.width > this.state.height ? 5 : 3;
    const maxSize = (this.state.width / avatarCount) - AVATAR_MARGIN;
    const iconSize = maxSize / 2;
    const iconBorderRadius = iconSize / 2;
    const spacing = {
      top: (maxSize - iconSize - TEXT_HEIGHT) / 2,
      left: (maxSize - iconSize) / 2,
    };

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={[LayoutStyle.centered, LayoutStyle.wrap, { marginTop: 20 }]}>
            {RACES.map(race => (
              <Card
                key={race.key}
                style={{
                  container: {
                    width: maxSize, height: maxSize - 10, marginHorizontal: 5, marginVertical: 5,
                  },
                }}
                onPress={() => this.setRace(race.key)}
              >
                <Image
                  style={{ width: maxSize, height: maxSize - 10 }}
                  source={race.image}
                  blurRadius={this.state.race && this.state.race.key === race.key ? 10 : 0}
                />
                <Text style={[styles.label, fadedBackgroundStyle]}>{race.name}</Text>
                {
                  this.state.race && this.state.race.key === race.key &&
                  <Icon
                    name="check-circle"
                    color={COLOR.green500}
                    size={iconSize}
                    style={{
                      position: 'absolute',
                      top: spacing.top,
                      left: spacing.left,
                      backgroundColor: COLOR.white,
                      borderRadius: iconBorderRadius,
                    }}
                  />
                }
              </Card>
            ))}
          </View>
          <View style={{ margin: 20, alignItems: 'center' }}>
            <Button
              primary
              raised
              disabled={!this.state.race}
              onPress={this.onPress}
              text="Proceed"
              style={{ container: { width: '100%', marginBottom: 20 } }}
            />
            {
              this.state.race &&
              <Card style={{ container: CardStyle.container }}>
                <Text style={CardStyle.cardHeading}>{this.state.race.name}</Text>
                <Text style={[CardStyle.cardText, CardStyle.extraPadding]}>
                  {this.state.race.description}
                </Text>
                <OGLButton sourceText="Source: Pathfinder Roleplaying Game Advanced Race Guide" />
              </Card>
            }
            {
              !this.state.race &&
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
  label: {
    position: 'absolute',
    bottom: 5,
    width: '100%',
    fontFamily: 'RobotoBold',
    color: COLOR.white,
    fontSize: 16,
    textAlign: 'center',
  },
  placeholderMessage: {
    fontFamily: 'RobotoLight',
    color: COLOR.grey700,
    fontSize: 18,
  },
});
