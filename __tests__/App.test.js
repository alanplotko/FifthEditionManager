import React from 'react';
import App from 'FifthEditionManager/App';

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
