import React from 'react';
import { CharacterBackground }
  from 'FifthEditionManager/screens/Character/Create/CharacterBackground';
import OGLButton from 'FifthEditionManager/components/OGLButton';
import { BACKGROUNDS } from 'FifthEditionManager/config/Info';

const t = require('tcomb-form-native');
const Chance = require('chance');

const chance = new Chance();

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
  const backgroundList = BACKGROUNDS.map(background => background.key);

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
    })).shallow();
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
    const wrapper = shallow(<CharacterBackground navigation={navigation} />).shallow().shallow();
    wrapper.find(t.form.Form).get(0).ref('test');
    expect(wrapper.instance()).toHaveProperty('form', 'test');
  });

  test('can select any background, view background details and OGL, and deselect background', () => {
    const wrapper = shallow(<CharacterBackground navigation={navigation} />).shallow().shallow();
    const backgroundForm = wrapper.find(t.form.Form);

    // Test background form options
    expect(backgroundForm.at(0).props().options.template(locals)).toMatchSnapshot();

    backgroundList.forEach((background) => {
      // Select background; confirm selection in state and OGL button
      backgroundForm.at(0).props().onChange({ background });
      wrapper.update();
      expect(wrapper.state()).toHaveProperty('background.key', background);
      expect(wrapper.find(OGLButton)).toHaveLength(3);
      expect(wrapper).toMatchSnapshot();

      // Deselect race; confirm deselection in state
      backgroundForm.at(0).props().onChange({ background: null });
      wrapper.update();
      expect(wrapper.state()).toHaveProperty('background', null);
      expect(wrapper.find(OGLButton)).toHaveLength(0);
      expect(wrapper).toMatchSnapshot();
    });
  });

  test('allows submission only after background and decision selections', () => {
    const wrapper = shallow(<CharacterBackground navigation={navigation} />).shallow().shallow();
    // Set up a spy to confirm successful submisisons
    const navigateSpy = sinon.spy(navigation, 'navigate');
    expect(navigateSpy.notCalled).toBe(true);

    BACKGROUNDS.forEach((background) => {
      // There should initially be 1 background form
      let forms = wrapper.find(t.form.Form);
      expect(forms).toHaveLength(1);

      // Submission blocked before background selection
      wrapper.find('ThemedComponent[text="Proceed"]').props().onPress();
      expect(navigateSpy.notCalled).toBe(true);

      // Select background
      forms.at(0).props().onChange({ background: background.key });
      wrapper.update();

      // Number of forms should now be 1 background form + (1 form * # decisions)
      forms = wrapper.find(t.form.Form);
      expect(forms).toHaveLength(1 + background.starting.decisions.length);

      // Randomize decisions
      background.starting.decisions.forEach((options, index) => {
        const decision = chance.pickone(options);
        // Simulate existing the decision dialog
        forms.at(index + 1).props().onChange(null);
        // Simulate selecting a decision
        forms.at(index + 1).props().onChange({ index, decision });
        expect(wrapper.state().selectedDecisions).toContain(decision);

        // Test decision form options
        expect(forms.at(index + 1).props().options.template(locals)).toMatchSnapshot();
      });

      // Submission allowed after background selection
      wrapper.find('ThemedComponent[text="Proceed"]').props().onPress();
      wrapper.update();
      expect(navigateSpy.calledOnce).toBe(true);

      // Return to clean state before selecting next background
      forms.at(0).props().onChange({ background: null });
      wrapper.update();
      navigateSpy.resetHistory();
      expect(navigateSpy.notCalled).toBe(true);
    });

    // Spy cleanup
    navigateSpy.restore();
  });

  test('can randomize background selection', () => {
    const wrapper = shallow(<CharacterBackground navigation={navigation} />).shallow().shallow();

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
  });

  test('can randomize background selection given only the default background list', () => {
    const wrapper = shallow(<CharacterBackground navigation={navigation} />).shallow().shallow();

    // Randomize when no background is selected
    expect(wrapper.state()).toHaveProperty('background', null);
    wrapper.instance().randomizeBackground();
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('background.key');
    const firstSelectionKey = wrapper.state().background.key;
    expect(backgroundList.includes(firstSelectionKey)).toBe(true);

    // Simulate there being no other backgrounds available aside from the currently selected one
    const backgroundFilterStub = sinon.stub(BACKGROUNDS, 'filter').returns([]);

    // Randomize when a background is selected
    wrapper.instance().randomizeBackground();
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('background.key');
    expect(backgroundList.includes(wrapper.state().background.key)).toBe(true);

    // No change on the next randomizeBackground call, since there's only one default background
    expect(wrapper.state().background.key).toEqual(firstSelectionKey);

    // Stub cleanup
    backgroundFilterStub.restore();
  });

  test('displays background that lacks data properly', () => {
    const wrapper = shallow(<CharacterBackground navigation={navigation} />).shallow().shallow();
    const backgroundForm = wrapper.find(t.form.Form);

    // Select sample background
    backgroundForm.at(0).props().onChange({ background: 'emptyBackgroundTest' });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
