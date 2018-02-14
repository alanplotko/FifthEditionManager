import React from 'react';
import App from 'FifthEditionManager/App';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

/* eslint-disable global-require */
require('react-native-mock-render/mock');
/* eslint-enable global-require */

configure({ adapter: new Adapter() });

jest.mock('ScrollView', () => {
  /* eslint-disable global-require */
  const mockComponent = require('react-native/jest/mockComponent');
  /* eslint-enable global-require */
  return mockComponent('ScrollView');
});

describe('renders app properly', () => {
  test('before assets have loaded', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.name()).toBe('AppLoading');
  });

  test('after assets have loaded', async () => {
    // Set up App and AppLoading component
    const wrapper = shallow(<App />);
    wrapper.dive();

    // Assets not loaded yet; expect not ready
    const promise = wrapper.instance().loadAssetsAsync();
    expect(wrapper.state()).toHaveProperty('isReady', false);

    // Load assets and update wrapper
    await expect(promise).resolves.toEqual(expect.anything());
    wrapper.update();

    // Assets loaded; expect ready
    expect(wrapper.state()).toHaveProperty('isReady', true);
    expect(wrapper.name()).toBe('ThemeProvider');
    expect(wrapper.dive().name()).toBe('NavigationContainer');
    expect(wrapper.props()).toHaveProperty('uiTheme');
  });
});
