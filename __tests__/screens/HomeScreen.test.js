import React from 'react';
import { HomeScreen } from 'FifthEditionManager/screens/HomeScreen';
import { Tab } from 'native-base';
import { Icon } from 'react-native-material-ui';

describe('Home Screen', () => {
  const navigation = { navigate: jest.fn() };
  const context = { uiTheme: DefaultTheme };

  test('displays activity indicator when loading data', () => {
    const wrapper = shallow(<HomeScreen navigation={navigation} />, { context });
    expect(wrapper.children().find('ActivityIndicator')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  test('gets data prior to mounting', async () => {
    const storageGetSpy = sinon.spy(AsyncStorage, 'multiGet');
    const wrapper = shallow(<HomeScreen navigation={navigation} />, { context });
    expect(wrapper.state()).toMatchObject({
      isLoading: true,
      isRefreshing: false,
      isModalVisible: false,
      modalContent: null,
      error: null,
      activity: [],
      campaigns: [],
      characters: [],
    });
    expect(storageGetSpy.calledOnce).toBe(true);
    expect(storageGetSpy.calledWithExactly([ACTIVITY_KEY, CAMPAIGN_KEY, CHARACTER_KEY])).toBe(true);
    expect(storageGetSpy.returnValues).toHaveLength(1);
    expect(storageGetSpy.returnValues[0]).resolves.toEqual(expect.arrayContaining([null]));
    storageGetSpy.restore();
  });

  test('displays default messages in tabs when no data exists', async () => {
    const wrapper = shallow(<HomeScreen navigation={navigation} />, { context });
    expect(wrapper.state()).toHaveProperty('isLoading', true);
    await wrapper.instance().getData();
    wrapper.update();
    expect(wrapper.state()).toMatchObject({
      isLoading: false,
      isRefreshing: false,
      isModalVisible: false,
      modalContent: null,
      error: null,
      activity: [],
      campaigns: [],
      characters: [],
    });
    expect(wrapper).toMatchSnapshot();

    // Confirm 3 main elements in the home screen
    expect(wrapper.children()).toHaveLength(3);
    const elements = ['ScrollableTabView', 'ActionButton', 'ReactNativeModal'];
    wrapper.children().map((element, index) => expect(element.name()).toEqual(elements[index]));

    // Confirm 3 default backdrop icons
    const icons = ['timeline', 'book', 'person'];
    expect(wrapper.find(Icon)).toHaveLength(3);
    wrapper.find(Icon).map((icon, i) => expect(icon.prop('name')).toEqual(icons[i]));

    // Confirm 3 tabs with default text
    const tabText = [
      [
        'First time here?',
        'Your activity feed will populate here over time.',
        'To get started, create a character or campaign!',
      ],
      [
        'First time here?',
        'No existing campaigns found.',
        'Let\'s get started!',
      ],
      [
        'First time here?',
        'No existing characters found.',
        'Let\'s get started!',
      ],
    ];
    expect(wrapper.find(Tab)).toHaveLength(3);
    wrapper.find(Tab).map((tab, tabPos) => tab.find('Styled(Text)').children()
      .map((text, i) => expect(text.text()).toEqual(tabText[tabPos][i])));
  });

  test('has correct fab actions', async () => {
    const wrapper = shallow(<HomeScreen navigation={navigation} />, { context });
    await wrapper.instance().getData();
    wrapper.update();

    // Confirm 2 fab actions
    const actions = [
      {
        icon: 'book',
        label: 'Campaign',
        name: null,
      },
      {
        icon: 'person',
        label: 'Character',
        name: 'SetCharacterRace',
      },
    ];
    expect(wrapper.find('ActionButton').prop('actions')).toHaveLength(2);
    wrapper.find('ActionButton').prop('actions')
      .map((action, i) => expect(action).toMatchObject(actions[i]));
  });

  test('can navigate using fab', async () => {
    const navigateSpy = sinon.spy(navigation, 'navigate');
    const wrapper = shallow(<HomeScreen navigation={navigation} />, { context });
    await wrapper.instance().getData();
    wrapper.update();

    // Confirm that fab options can be navigated to
    expect(navigateSpy.notCalled).toBe(true);

    wrapper.find('ActionButton').prop('actions').map((action, i) => {
      wrapper.find('ActionButton').props().onPress(action.name);
      expect(navigateSpy.getCall(i).args).toHaveLength(1);
      return expect(navigateSpy.getCall(i).args[0]).toEqual(action.name);
    });

    // Navigate called once for each fab action
    expect(navigateSpy.callCount).toEqual(wrapper.find('ActionButton').prop('actions').length);
    navigateSpy.restore();
  });
});
