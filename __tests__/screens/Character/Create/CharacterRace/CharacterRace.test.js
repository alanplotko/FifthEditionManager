import React from 'react';
import { CharacterRace } from 'FifthEditionManager/screens/Character/Create/CharacterRace';
import { Dimensions, Text } from 'react-native';
import { Button, Card } from 'react-native-material-ui';
import OGLButton from 'FifthEditionManager/components/OGLButton';
import { RACES } from 'FifthEditionManager/config/Info';

describe('Character Race Screen', () => {
  const navigation = { navigate: jest.fn(), setParams: jest.fn() };
  const context = { uiTheme: DefaultTheme };
  const raceList = RACES.map(race => race.key);

  test('can build navigation options', () => {
    const goBackSpy = sinon.spy();
    const randomizeRaceSpy = sinon.spy();
    const toolbarWrapper = shallow(CharacterRace.navigationOptions.header({
      navigation: {
        state: {
          routes: [{
            key: 'test',
            params: {
              randomizeRace: randomizeRaceSpy,
            },
          }],
          index: 0,
        },
        goBack: goBackSpy,
      },
    }));
    expect(goBackSpy.notCalled).toBe(true);
    expect(randomizeRaceSpy.notCalled).toBe(true);

    // Hit back button
    toolbarWrapper.props().onLeftElementPress();
    expect(goBackSpy.calledOnce).toBe(true);

    // Hit randomize button
    toolbarWrapper.props().onRightElementPress();
    expect(randomizeRaceSpy.calledOnce).toBe(true);
  });

  test('mounts and unmounts properly', () => {
    const addListenerSpy = sinon.spy(Dimensions, 'addEventListener');
    const removeListenerSpy = sinon.spy(Dimensions, 'removeEventListener');
    expect(addListenerSpy.notCalled).toBe(true);
    expect(removeListenerSpy.notCalled).toBe(true);

    // Listener added
    const wrapper = shallow(<CharacterRace navigation={navigation} />, { context });
    expect(addListenerSpy.calledOnce).toBe(true);
    expect(removeListenerSpy.notCalled).toBe(true);

    // Listener removed
    wrapper.unmount();
    expect(addListenerSpy.calledOnce).toBe(true);
    expect(removeListenerSpy.calledOnce).toBe(true);

    // Spy cleanup
    addListenerSpy.restore();
    removeListenerSpy.restore();
  });

  test('records new dimensions on orientation change', () => {
    const wrapper = shallow(<CharacterRace navigation={navigation} />, { context });
    expect(wrapper.state()).toHaveProperty('width');
    expect(wrapper.state()).toHaveProperty('height');
    const dims = { width: wrapper.state().width, height: wrapper.state().height };

    // Call orientation handler
    wrapper.instance().orientationHandler({
      window: {
        width: dims.height,
        height: dims.width,
      },
    });
    wrapper.update();

    // Confirm width and height were swapped
    expect(wrapper.state()).toHaveProperty('width', dims.height);
    expect(wrapper.state()).toHaveProperty('height', dims.width);
  });

  test('displays all race options properly', () => {
    const wrapper = shallow(<CharacterRace navigation={navigation} />, { context });
    const raceCards = wrapper.findWhere(n => n.type() === Card && raceList.includes(n.key()));
    expect(raceCards.length).toEqual(RACES.length);
    expect(wrapper).toMatchSnapshot();
  });

  test('can select any race, view race details and OGL, and deselect race', () => {
    const wrapper = shallow(<CharacterRace navigation={navigation} />, { context });
    const raceCards = wrapper.findWhere(n => n.type() === Card && raceList.includes(n.key()));
    expect(raceCards).toHaveLength(RACES.length);
    expect(wrapper.state()).toHaveProperty('race', null);
    for (let i = 0; i < RACES.length; i += 1) {
      // Select race; confirm selection in state and OGL button
      raceCards.at(i).props().onPress();
      wrapper.update();
      expect(wrapper.state()).toHaveProperty('race.key', raceCards.at(i).key());
      expect(wrapper.find(OGLButton)).toHaveLength(1);
      expect(wrapper.find(Text).last().dive().text())
        .toEqual(RACES.find(race => race.key === raceCards.at(i).key()).description);
      expect(wrapper).toMatchSnapshot();

      // Deselect race; confirm deselection in state
      raceCards.at(i).props().onPress();
      wrapper.update();
      expect(wrapper.state()).toHaveProperty('race', null);
      expect(wrapper.find(OGLButton)).toHaveLength(0);
      expect(wrapper.find(Text).last().dive().text())
        .toEqual('Selection details will display here');
      expect(wrapper).toMatchSnapshot();
    }
  });

  test('can submit race selection', () => {
    const navigateSpy = sinon.spy(navigation, 'navigate');
    const wrapper = shallow(<CharacterRace navigation={navigation} />, { context });
    const raceCards = wrapper.findWhere(n => n.type() === Card && raceList.includes(n.key()));
    expect(navigateSpy.notCalled).toBe(true);

    // Select race and submit race selection
    raceCards.at(0).props().onPress();
    wrapper.find(Button).props().onPress();
    wrapper.update();
    expect(navigateSpy.calledOnce).toBe(true);

    // Spy cleanup
    navigateSpy.restore();
  });

  test('skips submission when no race selected', () => {
    const navigateSpy = sinon.spy(navigation, 'navigate');
    const wrapper = shallow(<CharacterRace navigation={navigation} />, { context });
    expect(navigateSpy.notCalled).toBe(true);

    // Hit button to submit without selection
    wrapper.instance().onPress();
    wrapper.update();
    expect(navigateSpy.notCalled).toBe(true);

    // Spy cleanup
    navigateSpy.restore();
  });

  test('can randomize race selection', () => {
    const wrapper = shallow(<CharacterRace navigation={navigation} />, { context });

    // Randomize when no race is selected
    expect(wrapper.state()).toHaveProperty('race', null);
    wrapper.instance().randomizeRace();
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('race.key');
    const firstSelectionKey = wrapper.state().race.key;
    expect(raceList.includes(firstSelectionKey)).toBe(true);

    // Randomize when a race is selected
    wrapper.instance().randomizeRace();
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('race.key');
    expect(raceList.includes(wrapper.state().race.key)).toBe(true);
    expect(wrapper.state().race.key).not.toEqual(firstSelectionKey);
  });
});
