import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard, Text, ScrollView, View } from 'react-native';
import { Container, Content } from 'native-base';
import { Button, Toolbar } from 'react-native-material-ui';
import ContainerStyle from 'FifthEditionManager/stylesheets/ContainerStyle';
import { ALIGNMENTS, EXPERIENCE, RACES } from 'FifthEditionManager/config/Info';
import FormStyle from 'FifthEditionManager/stylesheets/FormStyle';
import { validateInteger, toProperList } from 'FifthEditionManager/util';

const t = require('tcomb-form-native');
const Chance = require('chance');

const chance = new Chance();

/**
 * Form valdiation setup
 */

// Integer in range [1, 20]
const Level = t.refinement(t.Number, n => n % 1 === 0 && n > 0 && n <= 20);
Level.getValidationErrorMessage = value => validateInteger(
  value,
  'Integer in range [1, 20]',
);

// Integer >= 0
const Experience = t.refinement(t.Number, n => n % 1 === 0 && n >= 0);
Experience.getValidationErrorMessage = value => validateInteger(
  value,
  'Minimum of 0',
);

// Integer >= 1
const Age = t.refinement(t.Number, n => n % 1 === 0 && n >= 1);
Age.getValidationErrorMessage = value => validateInteger(value, 'Minimum of 1');

const getExperienceRange = (level) => {
  const range = {
    min: null,
    max: null,
  };
  if (level === 20) {
    range.min = EXPERIENCE[level - 1];
  } else if (level >= 1 && level < 20) {
    range.min = EXPERIENCE[level - 1];
    range.max = EXPERIENCE[level] - 1;
  }
  return range;
};

const isInExperienceRange = (experience, range) => (
  range.max === null ?
    experience >= range.min :
    experience >= range.min && experience <= range.max
);

const Power = t.refinement(t.struct({
  level: Level,
  experience: Experience,
}), power => isInExperienceRange(
  power.experience,
  getExperienceRange(power.level),
));

Power.getValidationErrorMessage = (value) => {
  const range = getExperienceRange(value.level);
  if (range.max === null) {
    return `Level ${value.level} has a minimum of ${range.min} experience`;
  }
  return `Level ${value.level} experience range [${range.min}, ${range.max}]`;
};

const defaultError = () => 'Required';
t.Number.getValidationErrorMessage = defaultError;
t.String.getValidationErrorMessage = defaultError;

/**
 * Define character
 */

const AlignmentType = ALIGNMENTS.reduce((o, alignment) =>
  Object.assign(o, { [alignment]: alignment }), {});

const Character = t.struct({
  power: Power,
  firstName: t.String,
  lastName: t.String,
  gender: t.enums({
    Male: 'Male',
    Female: 'Female',
    Other: 'Other',
  }),
  alignment: t.enums(AlignmentType),
  age: Age,
  height: t.String,
  weight: t.String,
});

/**
 * Form template setup
 */

const template = locals => (
  <View>
    <Text style={FormStyle.heading}>Character Name</Text>
    <View style={FormStyle.horizontalLayout}>
      <View style={{ flex: 1, marginRight: 5 }}>
        {locals.inputs.firstName}
      </View>
      <View style={{ flex: 1, marginLeft: 5 }}>
        {locals.inputs.lastName}
      </View>
    </View>

    <Text style={FormStyle.heading}>Power</Text>
    {locals.inputs.power}

    <Text style={FormStyle.heading}>About</Text>
    <View style={{ flex: 1 }}>
      {locals.inputs.gender}
    </View>
    <View style={{ flex: 1 }}>
      {locals.inputs.alignment}
    </View>

    <Text style={FormStyle.heading}>Measurements</Text>
    <View style={{ flex: 1 }}>
      {locals.inputs.age}
    </View>
    <View style={{ flex: 1 }}>
      {locals.inputs.height}
    </View>
    <View style={{ flex: 1 }}>
      {locals.inputs.weight}
    </View>
  </View>
);

/**
 * Define form options
 */

const options = {
  template,
  fields: {
    firstName: {
      label: 'First Name',
    },
    lastName: {
      label: 'Last Name',
    },
    power: {
      auto: 'none',
      fields: {
        level: {
          label: 'Level',
          help: 'Integer in range [1, 20]',
        },
        experience: {
          label: 'Experience Points',
          help: 'Select valid level to view range',
        },
      },
    },
    gender: {
      label: 'Gender',
      nullOption: { value: '', text: 'Select Gender' },
    },
    alignment: {
      label: 'Alignment',
      nullOption: { value: '', text: 'Select Alignment' },
    },
    age: {
      label: 'Age',
      placeholder: 'In years',
    },
    height: {
      label: 'Height',
      placeholder: 'e.g. 5\'5"',
    },
    weight: {
      label: 'Weight',
      placeholder: 'e.g. 130 lbs.',
    },
  },
};

export default class SetUpProfile extends React.Component {
  static navigationOptions = {
    header: ({ navigation }) => {
      const { routes, index } = navigation.state;
      const props = {
        leftElement: 'arrow-back',
        onLeftElementPress: () => navigation.goBack(),
        centerElement: 'Character Profile',
        rightElement: 'autorenew',
        onRightElementPress: () => routes[index].params.generateCharacter(),
      };
      return <Toolbar {...props} />;
    },
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const { lookupKey } = props.navigation.state.params.character.profile.race;
    this.state = {
      options,
      form: null,
      race: RACES.find(race => race.key === lookupKey),
    };
    this.state.options.fields.alignment.help = `${this.state.race.plural} tend to be ${toProperList(this.state.race.alignment.include, 'and', false)}`;
    this.state.options.fields.age.help = `${this.state.race.plural} typically reach adulthood at ${this.state.race.age.adulthood} and live to approximately ${this.state.race.age.lifespan} years`;
    this.state.options.fields.height.help = `${this.state.race.plural} are typically ${this.state.race.height.base} + ${this.state.race.height.modifier.join('d')} inches tall`;
    this.state.options.fields.weight.help = `${this.state.race.plural} typically weigh ${this.state.race.weight.base} + (your height modifier roll * ${this.state.race.weight.modifier.join('d')}) inches tall`;
  }

  componentDidMount() {
    this.props.navigation.setParams({
      generateCharacter: this.generateCharacter,
    });
  }

  onPress = () => {
    Keyboard.dismiss();
    const generalInfo = this.form.getValue();
    if (generalInfo) {
      const { navigate, state } = this.props.navigation;
      const newCharacter = Object.assign({}, state.params.character);
      newCharacter.lastUpdated = Date.now();
      newCharacter.profile = Object.assign({}, newCharacter.profile, generalInfo);

      // Flatten nested power object
      newCharacter.profile.level = newCharacter.profile.power.level;
      newCharacter.profile.experience = newCharacter.profile.power.experience;
      delete newCharacter.profile.power;

      navigate('ChooseScoringMethod', { character: newCharacter });
    }
  }

  onChange = (value) => {
    let helpText = 'Select valid level to view range';
    if (value && Object.prototype.hasOwnProperty.call(value, 'power') &&
        Object.prototype.hasOwnProperty.call(value.power, 'level') &&
        value.power.level.length > 0) {
      const level = parseInt(value.power.level, 10);
      const range = getExperienceRange(level);
      if (range.min !== null) {
        if (range.max === null) {
          helpText = `Minimum of ${range.min}`;
        } else {
          helpText = `Range [${range.min}, ${range.max}]`;
        }
      }
    }
    const updatedOptions = t.update(this.state.options, {
      fields: {
        power: {
          fields: {
            experience: {
              help: { $set: helpText },
            },
          },
        },
      },
    });
    this.setState({ options: updatedOptions, form: value });
  }

  generateCharacter = () => {
    Keyboard.dismiss();
    let gender;
    let firstName;
    let lastName;
    if (chance.bool()) {
      gender = 'Other';
      firstName = chance.first();
      lastName = chance.last();
    } else {
      gender = chance.gender();
      firstName = chance.first({ gender });
      lastName = chance.last({ gender });
    }
    let heightModifier = 0;
    for (let i = 0; i < this.state.race.height.modifier[0]; i += 1) {
      heightModifier += chance.natural({ min: 1, max: this.state.race.height.modifier[1] });
    }
    let weightModifier = 0;
    for (let i = 0; i < this.state.race.weight.modifier[0]; i += 1) {
      weightModifier += chance.natural({ min: 1, max: this.state.race.weight.modifier[1] });
    }
    const height = this.state.race.height.base + heightModifier;
    const weight = this.state.race.weight.base + (heightModifier * weightModifier);
    this.setState({
      form: {
        firstName,
        lastName,
        power: { level: 1, experience: 0 },
        gender,
        alignment: chance.pickone(ALIGNMENTS.filter((alignment) => {
          const sides = alignment.toLowerCase().split(' ');
          const includeCheck = alignment.toLowerCase() === 'true neutral' ||
            this.state.race.alignment.include.includes(sides[0]) ||
            this.state.race.alignment.include.includes(sides[1]);
          const excludeCheck = !this.state.race.alignment.exclude.includes(sides[0]) &&
            !this.state.race.alignment.exclude.includes(sides[1]);
          return includeCheck && excludeCheck;
        })),
        age: chance.natural({
          min: Math.floor(this.state.race.age.adulthood / 1.2),
          max: this.state.race.age.lifespan,
        }),
        height: `${Math.floor(height / 12)}' ${height % 12}"`,
        weight: `${weight} lbs.`,
      },
    });
  }

  render() {
    // Update form options for focus on next field
    const fieldOrder = [
      ['firstName'],
      ['lastName'],
      ['power', 'level'],
      ['power', 'experience'],
      ['age'],
      ['height'],
      ['weight'],
    ];
    fieldOrder.forEach((name, index) => {
      if (index + 1 < fieldOrder.length) {
        if (name.length === 1) {
          options.fields[name[0]].onSubmitEditing = () => {
            this.form.getComponent(fieldOrder[index + 1]).refs.input.focus();
          };
        } else {
          // Traverse to nensted field
          options.fields[name[0]].fields[name[1]].onSubmitEditing = () => {
            this.form.getComponent(fieldOrder[index + 1]).refs.input.focus();
          };
        }
      }
    });

    return (
      <Container style={ContainerStyle.parent}>
        <Content>
          <ScrollView style={{ margin: 20 }} keyboardShouldPersistTaps="always">
            <t.form.Form
              ref={(c) => { this.form = c; }}
              type={Character}
              value={this.state.form}
              options={this.state.options}
              onChange={this.onChange}
            />
            <Button
              primary
              raised
              onPress={this.onPress}
              text="Proceed"
              style={{ container: { width: '100%', marginVertical: 20 } }}
            />
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
