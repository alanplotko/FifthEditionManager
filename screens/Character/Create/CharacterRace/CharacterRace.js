import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, View, Text, Image } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Card, COLOR, Icon, Toolbar, withTheme } from 'react-native-material-ui';
import { RACES } from 'FifthEditionManager/config/Info';
import { CardStyle, ContainerStyle } from 'FifthEditionManager/stylesheets';
import OGLButton from 'FifthEditionManager/components/OGLButton';
import Note from 'FifthEditionManager/components/Note';

const uuidv4 = require('uuid/v4');
const Chance = require('chance');

const chance = new Chance();

class CharacterRace extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      race: null,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.orientationHandler);
    this.props.navigation.setParams({ randomizeRace: this.randomizeRace });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.orientationHandler);
  }

  onPress = () => {
    if (this.state.race) {
      const { navigate } = this.props.navigation;
      const timestamp = Date.now();

      // Set up new character object
      const newCharacter = {
        key: uuidv4(),
        meta: {
          created: timestamp,
          lastUpdated: timestamp,
        },
        race: {
          lookupKey: this.state.race.key,
          name: this.state.race.name,
        },
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
    // Do not reselect current option
    const key = this.state.race ? this.state.race.key : null;
    this.setState({ race: chance.pickone(RACES.filter(race => race.key !== key)) });
  }

  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(routes[index].key),
        centerElement: 'Character Race',
        rightElement: 'autorenew',
        onRightElementPress: () => routes[index].params.randomizeRace(),
      };
      return <Toolbar {...props} />;
    },
  }

  render() {
    // Theme setup
    const { palette } = this.props.theme;
    const fadedTextStyle = { color: palette.fadedTextColor };
    const fadedBackgroundStyle = { backgroundColor: palette.fadedBackgroundColor };

    // Portrait configuration
    const maxRowItems = this.state.width > this.state.height ? 5 : 3;
    const maxImageSize = (this.state.width / maxRowItems) - 20; // 20 = 10 margin/side * 2 sides
    const sizeStyle = { width: maxImageSize, height: maxImageSize - 10 };

    // Check icon configuration
    const iconSize = maxImageSize / 2;
    const iconBorderRadius = iconSize / 2;

    // Portrait text label configuration
    const spacing = {
      // Label height = 35 = race name text height (25) + bottom padding (10) (estimation)
      top: (maxImageSize - iconSize - 35) / 2,
      left: (maxImageSize - iconSize) / 2,
    };

    const portraitCard = race => (
      <Card
        key={race.key}
        style={{ container: sizeStyle }}
        onPress={() => this.setRace(race.key)}
      >
        <Image
          style={sizeStyle}
          source={race.image}
          blurRadius={this.state.race && this.state.race.key === race.key ? 3 : 0}
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
    );

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <View style={[ContainerStyle.padded, { paddingBottom: 0 }]}>
            <Note
              title="Choosing a Race"
              type="tip"
              icon="lightbulb-outline"
            >
              <Text>
                The race you choose will determine what basic advantages and traits your character
                will possess.
              </Text>
            </Note>
          </View>
          <View style={styles.grid}>{RACES.map(race => portraitCard(race))}</View>
          <View style={ContainerStyle.padded}>
            <Button
              primary
              raised
              disabled={!this.state.race}
              onPress={this.onPress}
              text="Proceed"
              style={{ container: { marginBottom: 10 } }}
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
                      color: palette.backdropIconColor,
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
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default withTheme(CharacterRace);
