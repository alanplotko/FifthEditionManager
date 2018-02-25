import React from 'react';
import App from 'FifthEditionManager/App';

describe('App', () => {
  test('renders properly before assets have loaded', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.name()).toBe('AppLoading');
    expect(wrapper).toMatchSnapshot();
  });

  test('renders properly after assets have loaded', async () => {
    const wrapper = shallow(<App />);
    wrapper.dive();

    // Assets should not have loaded yet
    const promise = wrapper.find('AppLoading').props().startAsync();
    expect(wrapper.state()).toMatchObject({
      isReady: false,
      error: null,
    });

    // Load assets
    await expect(promise).resolves.toEqual(expect.anything());
    wrapper.find('AppLoading').props().onFinish();
    wrapper.update();

    // Assets should be loaded
    expect(wrapper.state()).toMatchObject({
      isReady: true,
      error: null,
    });
    expect(wrapper.name()).toBe('ThemeProvider');
    expect(wrapper.dive().name()).toBe('NavigationContainer');
    expect(wrapper.props()).toHaveProperty('uiTheme');
    expect(wrapper).toMatchSnapshot();
  });

  test('displays error when assets fail to load', async () => {
    // Stub loadAssetsAsync to fail
    const error = new Error('Error');
    const loadAssetsStub = sinon.stub(App, 'loadAssetsAsync').rejects(error);
    const wrapper = shallow(<App />);

    // Assets should fail to load
    const promise = wrapper.find('AppLoading').props().startAsync();
    await expect(promise).rejects.toEqual(error);

    // Manually execute AppLoading's onError function
    wrapper.find('AppLoading').props().onError(error);
    wrapper.update();
    expect(wrapper.state()).toMatchObject({
      isReady: false,
      error,
    });

    // Error should display
    expect(wrapper).toMatchSnapshot();

    // Clean up stub
    loadAssetsStub.restore();
  });

  test('loads assets on retry after error', async () => {
    // Stub loadAssetsAsync to fail
    const error = new Error('Error');
    const loadAssetsStub = sinon.stub(App, 'loadAssetsAsync').rejects(error);
    const wrapper = shallow(<App />);

    // AppLoading should display first
    expect(wrapper).toMatchSnapshot();

    // Assets should fail to load
    let promise = wrapper.find('AppLoading').props().startAsync();
    await expect(promise).rejects.toEqual(error);
    wrapper.find('AppLoading').props().onError(error);
    wrapper.update();

    // Error message should display
    expect(wrapper).toMatchSnapshot();

    // Simulate cause of error being resolved using stub
    loadAssetsStub.restore();

    // Retry loading assets
    wrapper.find('Button').props().onPress();
    wrapper.update();

    // AppLoading should display again
    expect(wrapper).toMatchSnapshot();

    // Assets should load properly
    promise = wrapper.find('AppLoading').props().startAsync();
    await expect(promise).resolves.toEqual(expect.anything());
    promise = wrapper.find('AppLoading').props().onFinish();
    wrapper.update();

    // Assets should be loaded
    expect(wrapper.state()).toMatchObject({
      isReady: true,
      error: null,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
