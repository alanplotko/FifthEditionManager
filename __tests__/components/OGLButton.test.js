import React from 'react';
import OGLButton from 'FifthEditionManager/components/OGLButton';

describe('OGL Button', () => {
  test('renders properly', () => {
    const context = { uiTheme: DefaultTheme };
    const wrapper = shallow(<OGLButton sourceText="Test Source" />, { context });
    expect(wrapper).toMatchSnapshot();
  });
});
