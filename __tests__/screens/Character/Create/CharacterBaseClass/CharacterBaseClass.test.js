import React from 'react';
import { CharacterBaseClass }
  from 'FifthEditionManager/screens/Character/Create/CharacterBaseClass';
import { Button } from 'react-native-material-ui';
import OGLButton from 'FifthEditionManager/components/OGLButton';
import { CLASSES } from 'FifthEditionManager/config/Info';

const t = require('tcomb-form-native');

describe('Character Base Class Screen', () => {
  const state = {
    params: {
      character: {
        meta: { lastUpdated: null },
        race: { name: 'Human' },
      },
    },
  };
  const locals = {
    inputs: { baseClass: null },
    stylesheet: null,
  };
  const navigation = { navigate: jest.fn(), setParams: jest.fn(), state };
  const context = { uiTheme: DefaultTheme };
  const classList = CLASSES.map(baseClass => baseClass.key);

  test('can build navigation options', () => {
    const goBackSpy = sinon.spy();
    const randomizeClassSpy = sinon.spy();
    const toolbarWrapper = shallow(CharacterBaseClass.navigationOptions.header({
      navigation: {
        state: {
          routes: [{
            key: 'test',
            params: {
              randomizeClass: randomizeClassSpy,
            },
          }],
          index: 0,
        },
        goBack: goBackSpy,
      },
    }));
    expect(goBackSpy.notCalled).toBe(true);
    expect(randomizeClassSpy.notCalled).toBe(true);

    // Hit back button
    toolbarWrapper.props().onLeftElementPress();
    expect(goBackSpy.calledOnce).toBe(true);

    // Hit randomize button
    toolbarWrapper.props().onRightElementPress();
    expect(randomizeClassSpy.calledOnce).toBe(true);
  });

  test('can set form reference properly', () => {
    const wrapper = shallow(<CharacterBaseClass navigation={navigation} />, { context });
    wrapper.find(t.form.Form).get(0).ref('test');
    expect(wrapper.instance()).toHaveProperty('form', 'test');
  });

  test('can select any class, view class details and OGL, and deselect class', () => {
    const wrapper = shallow(<CharacterBaseClass navigation={navigation} />, { context });
    const classForm = wrapper.find(t.form.Form);

    // Test form options
    expect(classForm.at(0).props().options.template(locals)).toMatchSnapshot();

    classList.forEach((baseClass) => {
      // Select class; confirm selection in state and OGL button
      classForm.at(0).props().onChange({ baseClass });
      wrapper.update();
      expect(wrapper.state()).toHaveProperty('form.baseClass', baseClass);
      expect(wrapper.state()).toHaveProperty('baseClass.key', baseClass);
      expect(wrapper.find(OGLButton)).toHaveLength(2);
      expect(wrapper).toMatchSnapshot();

      // Deselect race; confirm deselection in state
      classForm.at(0).props().onChange({ baseClass: '' });
      wrapper.update();
      expect(wrapper.state()).toHaveProperty('form.baseClass', '');
      expect(wrapper.state()).toHaveProperty('baseClass', undefined);
      expect(wrapper.find(OGLButton)).toHaveLength(0);
      expect(wrapper).toMatchSnapshot();
    });
  });

  test('allows submission only after class selection', () => {
    const navigateSpy = sinon.spy(navigation, 'navigate');
    const wrapper = shallow(<CharacterBaseClass navigation={navigation} />, { context });
    const classForm = wrapper.find(t.form.Form);
    expect(navigateSpy.notCalled).toBe(true);

    // Submission blocked before class selection
    wrapper.find(Button).props().onPress();
    expect(navigateSpy.notCalled).toBe(true);

    // Submission allowed after class selection
    classForm.at(0).props().onChange({ baseClass: CLASSES[0].key });
    wrapper.find(Button).props().onPress();
    wrapper.update();
    expect(navigateSpy.calledOnce).toBe(true);

    // Spy cleanup
    navigateSpy.restore();
  });

  test('can randomize class selection', () => {
    const wrapper = shallow(<CharacterBaseClass navigation={navigation} />, { context });

    // Randomize when no class is selected
    expect(wrapper.state()).toHaveProperty('baseClass', null);
    wrapper.instance().randomizeClass();
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('baseClass.key');
    const firstSelectionKey = wrapper.state().baseClass.key;
    expect(classList.includes(firstSelectionKey)).toBe(true);

    // Randomize when a class is selected
    wrapper.instance().randomizeClass();
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('baseClass.key');
    expect(classList.includes(wrapper.state().baseClass.key)).toBe(true);
    expect(wrapper.state().baseClass.key).not.toEqual(firstSelectionKey);
  });

  test('displays class that lacks data properly', () => {
    const wrapper = shallow(<CharacterBaseClass navigation={navigation} />, { context });
    const classForm = wrapper.find(t.form.Form);
    const sampleClass = {
      key: 'sample',
      name: 'Sample',
      description: 'Description text.',
      hitDie: 8,
      proficiencies: {
        savingThrows: [],
        armor: [],
        weapons: [],
        tools: [{}, {}, {}], // Empty tool objects
        skills: {
          options: [],
          optionKeys: [],
          quantity: 2,
        },
      },
      image: null,
    };
    const classStub = sinon.stub(CLASSES, 'find');
    classStub.returns(sampleClass);

    // Select sample class
    classForm.at(0).props().onChange({ baseClass: sampleClass.key });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();

    // Stub cleanup
    classStub.restore();
  });
});
