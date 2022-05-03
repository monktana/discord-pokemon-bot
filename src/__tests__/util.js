const {capitalize, calculateEffectiveness, parseEffectiveness, filterSuperEffectiveMatchups, filterEffectiveMatchups, filterNotEffectiveMatchups, filterNoEffectMatchups} = require('./../utils/utils');

describe('capitalize', () => {
  it('capitalizes the first character of an input string', async () => {
    const first = capitalize('input');
    const second = capitalize('iNPUT');

    expect(first).toBe('Input');
    expect(second).toBe('INPUT');
  });

  it('doesnt alter an already capitalized string', async () => {
    const capitalized = capitalize('Input');

    expect(capitalized).toBe('Input');
  });

  it('doesnt alter an all uppercase string', async () => {
    const capitalized = capitalize('INPUT');

    expect(capitalized).toBe('INPUT');
  });

  it('has no effect if the first character is numerical', async () => {
    const first = capitalize('123');
    const second = capitalize('1nput');

    expect(first).toBe('123');
    expect(second).toBe('1nput');
  });

  it.only('has no effect if the first character is a special character', async () => {
    const first = capitalize(' nput');
    const second = capitalize('$nput');

    expect(first).toBe(' nput');
    expect(second).toBe('$nput');
  });
});