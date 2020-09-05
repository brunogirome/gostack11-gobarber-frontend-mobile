import React from 'react';
import { render } from 'react-native-testing-library';

import SignIn from '../../pages/SignIn/index';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
  };
});

describe('SignIn page', () => {
  it('should contains email and password input', () => {
    const { getByPlaceholder } = render(<SignIn />);

    expect(getByPlaceholder('E-mail')).toBeTruthy();
    expect(getByPlaceholder('Password')).toBeTruthy();
  });
});
