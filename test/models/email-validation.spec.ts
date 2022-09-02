import Email from '../../src/models/email';

describe('Email validation', () => {
  test('should not accept empty email', () => {
    expect(Email.validate(null)).toBeFalsy();
  });

  test('should return false for emails bigger than 320 chars', () => {
    let address = 'a';
    expect(Email.validate(address.repeat(310) + '@emails.com')).toBeFalsy();
  });

})