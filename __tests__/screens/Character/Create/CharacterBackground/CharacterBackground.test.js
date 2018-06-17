import React from 'react';
import { CharacterBackground }
  from 'FifthEditionManager/screens/Character/Create/CharacterBackground';
import { Button } from 'react-native-material-ui';
import OGLButton from 'FifthEditionManager/components/OGLButton';
import { BACKGROUNDS } from 'FifthEditionManager/config/Info';
import { cloneDeep } from 'lodash';

const t = require('tcomb-form-native');

describe('Character Background Screen', () => {
  const state = {
    params: {
      character: {
        meta: { lastUpdated: null },
        race: { name: 'Human' },
      },
    },
  };
  const locals = {
    inputs: { background: null },
    stylesheet: null,
  };
  const navigation = { navigate: jest.fn(), setParams: jest.fn(), state };
  const context = { uiTheme: DefaultTheme };
  const backgroundList = BACKGROUNDS.map(background => background.key).concat('sample');

  test('can build navigation options', () => {
    const goBackSpy = sinon.spy();
    const randomizeBackgroundSpy = sinon.spy();
    const toolbarWrapper = shallow(CharacterBackground.navigationOptions.header({
      navigation: {
        state: {
          routes: [{
            key: 'test',
            params: {
              randomizeBackground: randomizeBackgroundSpy,
            },
          }],
          index: 0,
        },
        goBack: goBackSpy,
      },
    }));
    expect(goBackSpy.notCalled).toBe(true);
    expect(randomizeBackgroundSpy.notCalled).toBe(true);

    // Hit back button
    toolbarWrapper.props().onLeftElementPress();
    expect(goBackSpy.calledOnce).toBe(true);

    // Hit randomize button
    toolbarWrapper.props().onRightElementPress();
    expect(randomizeBackgroundSpy.calledOnce).toBe(true);
  });

  test('can set form reference properly', () => {
    const wrapper = shallow(<CharacterBackground navigation={navigation} />, { context });
    wrapper.find(t.form.Form).get(0).ref('test');
    expect(wrapper.instance()).toHaveProperty('form', 'test');
  });

  test('can select any background, view background details and OGL, and deselect background', () => {
    const wrapper = shallow(<CharacterBackground navigation={navigation} />, { context });
    const backgroundForm = wrapper.find(t.form.Form);

    // Set up multiple backgrounds
    const backgroundCopy = BACKGROUNDS.slice(0);
    backgroundCopy.push(cloneDeep(BACKGROUNDS[0]));
    backgroundCopy[1].key = 'sample';
    backgroundCopy[1].name = 'Sample';
    const backgroundFindStub = sinon.stub(BACKGROUNDS, 'find');
    backgroundFindStub.onCall(0).returns(backgroundCopy[0]);
    backgroundFindStub.onCall(2).returns(backgroundCopy[1]);

    // Test form options
    expect(backgroundForm.at(0).props().options.template(locals)).toMatchSnapshot();

    backgroundList.forEach((background) => {
      // Select background; confirm selection in state and OGL button
      backgroundForm.at(0).props().onChange({ background });
      wrapper.update();
      expect(wrapper.state()).toHaveProperty('form.background', background);
      expect(wrapper.state()).toHaveProperty('background.key', background);
      expect(wrapper.find(OGLButton)).toHaveLength(3);
      expect(wrapper).toMatchSnapshot();

      // Deselect race; confirm deselection in state
      backgroundForm.at(0).props().onChange({ background: '' });
      wrapper.update();
      expect(wrapper.state()).toHaveProperty('form.background', '');
      expect(wrapper.state()).toHaveProperty('background', undefined);
      expect(wrapper.find(OGLButton)).toHaveLength(0);
      expect(wrapper).toMatchSnapshot();
    });

    // Stub cleanup
    backgroundFindStub.restore();
  });

  test('allows submission only after background and decision selections', () => {
    const navigateSpy = sinon.spy(navigation, 'navigate');
    const wrapper = shallow(<CharacterBackground navigation={navigation} />, { context });
    let forms = wrapper.find(t.form.Form);
    expect(forms).toHaveLength(1);
    expect(navigateSpy.notCalled).toBe(true);

    // Submission blocked before background selection
    wrapper.find(Button).props().onPress();
    expect(navigateSpy.notCalled).toBe(true);

    // Select background (acolyte)
    wrapper.instance().onChangeBackground({ background: BACKGROUNDS[0].key });
    wrapper.update();

    // Decision form should be visible, so 2 forms in total
    forms = wrapper.find(t.form.Form);
    expect(forms).toHaveLength(2);

    // Select decision
    wrapper.instance().onChangeDecision({
      index: 0,
      decision: BACKGROUNDS[0].starting.decisions[0][0],
    });
    expect(wrapper.state().selectedDecisions).toContain(BACKGROUNDS[0].starting.decisions[0][0]);

    // Submission allowed after background selection
    wrapper.find(Button).props().onPress();
    wrapper.update();
    expect(navigateSpy.calledOnce).toBe(true);

    // Spy cleanup
    navigateSpy.restore();
  });

  test('can randomize background selection', () => {
    const wrapper = shallow(<CharacterBackground navigation={navigation} />, { context });

    // Set up multiple backgrounds
    const backgroundCopy = BACKGROUNDS.slice(0);
    backgroundCopy.push(cloneDeep(BACKGROUNDS[0]));
    backgroundCopy[1].key = 'sample';
    backgroundCopy[1].name = 'Sample';

    // Call filter on backgroundCopy instead of BACKGROUNDS
    const backgroundFilterStub = sinon.stub(BACKGROUNDS, 'filter')
      .callsFake(filter => backgroundCopy.filter(filter));

    // Randomize when no background is selected
    expect(wrapper.state()).toHaveProperty('background', null);
    wrapper.instance().randomizeBackground();
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('background.key');
    const firstSelectionKey = wrapper.state().background.key;
    expect(backgroundList.includes(firstSelectionKey)).toBe(true);

    // Randomize when a background is selected
    wrapper.instance().randomizeBackground();
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('background.key');
    expect(backgroundList.includes(wrapper.state().background.key)).toBe(true);
    expect(wrapper.state().background.key).not.toEqual(firstSelectionKey);

    // Stub cleanup
    backgroundFilterStub.restore();
  });

  test('displays background that lacks data properly', () => {
    const wrapper = shallow(<CharacterBackground navigation={navigation} />, { context });
    const backgroundForm = wrapper.find(t.form.Form);

    // Create sample background
    const sampleBackground = {
      key: 'sample',
      name: 'Sample',
      description: 'Description text.',
      starting: {
        decisions: [],
        equipment: [],
        money: null,
      },
      additionalLanguages: 0,
      proficiencies: {
        skills: [],
        skillKeys: [],
        tools: [],
      },
    };
    const backgroundFindStub = sinon.stub(BACKGROUNDS, 'find');
    backgroundFindStub.returns(sampleBackground);

    // Select sample background
    backgroundForm.at(0).props().onChange({ background: sampleBackground.key });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();

    // Stub cleanup
    backgroundFindStub.restore();
  });
});
