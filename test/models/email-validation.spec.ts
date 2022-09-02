import Email from '../../src/models/email';

describe('Email validation', () => {
  test('should not accept empty email', () => {
    expect(Email.validate(null)).toBeFalsy();
  });

  test('should return false for emails bigger than 320 chars', () => {
    let address = 'a';
    expect(Email.validate(address.repeat(310) + '@emails.com')).toBeFalsy();
  });

  test('should have username size limited to 64 chars', () => {
    let username = 'a';
    expect(Email.validate(username.repeat(65) + '@email.com')).toBeFalsy();
  });

  test('domain size should not be greater than 255 chars', () => {
    let domain = 'a'.repeat(256);
    expect(Email.validate('username@' + domain)).toBeFalsy();
  });

})