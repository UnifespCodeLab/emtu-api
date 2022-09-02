import Email from '../../src/models/email';

describe('Email validation', () => {
  test('should not accept empty email', () => {
    expect(Email.validate(null)).toBeFalsy();
  });
})