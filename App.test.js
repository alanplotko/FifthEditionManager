import React from 'react';
import App from 'DNDManager/App';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

/* eslint-disable-line global-require */
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
    const wrapper = shallow(<App />);
    // Load font assets
    await wrapper.instance().loadFontAssets();
    wrapper.update();
    expect(wrapper.name()).toBe('ThemeProvider');
    expect(wrapper.dive().name()).toBe('NavigationContainer');
    expect(wrapper.props()).toHaveProperty('uiTheme');
  });
});
