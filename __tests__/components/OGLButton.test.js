import React from 'react';
import OGLButton from 'FifthEditionManager/components/OGLButton';

describe('OGL Button', () => {
  test('renders properly', () => {
    const wrapper = shallow(<OGLButton sourceText="Test Source" />).shallow();
    expect(wrapper).toMatchSnapshot();
  });

  test('can toggle modal properly', () => {
    const wrapper = shallow(<OGLButton sourceText="Test Source" />);

    // License is currently not visible
    expect(wrapper.state()).toMatchObject({ isLicenseVisible: false });

    // Click button to open license modal
    wrapper.shallow().find('ThemedComponent[text="Test Source"]').props().onPress();
    wrapper.update();
    expect(wrapper.state()).toMatchObject({ isLicenseVisible: true });

    // Hide license by hitting back button
    wrapper.find('ReactNativeModal').props().onBackButtonPress();
    wrapper.update();
    expect(wrapper.state()).toMatchObject({ isLicenseVisible: false });

    // Click button to open license modal again
    wrapper.find('ThemedComponent[text="Test Source"]').props().onPress();
    wrapper.update();
    expect(wrapper.state()).toMatchObject({ isLicenseVisible: true });

    // Hide license by clicking on backdrop
    wrapper.find('ReactNativeModal').props().onBackdropPress();
    wrapper.update();
    expect(wrapper.state()).toMatchObject({ isLicenseVisible: false });
  });
});
