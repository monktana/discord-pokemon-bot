const {capitalize, calculateEffectiveness, parseEffectiveness, filterSuperEffectiveMatchups, filterEffectiveMatchups, filterNotEffectiveMatchups, filterNoEffectMatchups} = require('./../utils/utils');
const defendingTypes = require('./fixtures/defendingTypes');
const attackingType = require('./fixtures/attackingType');

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

  it('has no effect if the first character is a special character', async () => {
    const first = capitalize(' nput');
    const second = capitalize('$nput');

    expect(first).toBe(' nput');
    expect(second).toBe('$nput');
  });
});

describe('calculateEffectiveness', () => {
  it('calculates the effectiveness if a type attacks one defending type', () => {
    const defendingType = [defendingTypes.types[0]];
    const effectiveness = calculateEffectiveness(attackingType, defendingType);

    expect(effectiveness).toBe(0.5);
  });

  it('calculates the effectiveness if a type attacks multiple defending type', () => {
    const effectiveness = calculateEffectiveness(attackingType, defendingTypes.types);

    expect(effectiveness).toBe(0.25);
  });

  it('throws an error if attackingType is missing the necessary properties', () => {
    expect.assertions(1);

    try {
      calculateEffectiveness({falsyObject: true}, defendingTypes.types);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  it('throws an error if the matchups property on attackingType is not an array', () => {
    expect.assertions(1);

    try {
      calculateEffectiveness({matchups: 0}, defendingTypes.types);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  it('throws an error if defendingTypes is not an array of objects', () => {
    expect.assertions(1);

    try {
      calculateEffectiveness(attackingType, {falsyObject: true});
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  it('throws an error if a defendingType is missing the necessary properties', () => {
    expect.assertions(1);

    try {
      calculateEffectiveness(attackingType, [{falsyObject: true}]);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });
});

describe('parseEffectiveness', () => {
  it('parses a number between 0 and 4 into the correct corresponding message', () => {
    const noEffect = parseEffectiveness(0);
    const notVeryEffectiveQuarter = parseEffectiveness(0.25);
    const notVeryEffectiveHalf = parseEffectiveness(0.5);
    const effective = parseEffectiveness(1);
    const superEffectivDouble = parseEffectiveness(2);
    const superEffectivFourTimes = parseEffectiveness(4);

    expect(noEffect).toBe('No effect');
    expect(notVeryEffectiveQuarter).toBe('Not very effective');
    expect(notVeryEffectiveHalf).toBe('Not very effective');
    expect(effective).toBe('Effective');
    expect(superEffectivDouble).toBe('Super effective');
    expect(superEffectivFourTimes).toBe('Super effective');
  });

  it('handles a numerical input below 0 with an unknown message', () => {
    expect(parseEffectiveness(-0.5)).toBe('Unknown');
    expect(parseEffectiveness(-1)).toBe('Unknown');
  });

  it('handles a numerical input above 4 with an unknown message', () => {
    expect(parseEffectiveness(4.1)).toBe('Unknown');
    expect(parseEffectiveness(5)).toBe('Unknown');
  });

  it('handles a numerical input, which is not 0, 0.25, 0.5, 1, 2 or 4 with an unknown message', () => {
    expect(parseEffectiveness(0.75)).toBe('Unknown');
    expect(parseEffectiveness(1.5)).toBe('Unknown');
    expect(parseEffectiveness(3)).toBe('Unknown');
  });

  it('handles non numerical input with an unknown message', () => {
    expect(parseEffectiveness(undefined)).toBe('Unknown');
    expect(parseEffectiveness(null)).toBe('Unknown');

    expect(parseEffectiveness(true)).toBe('Unknown');

    expect(parseEffectiveness('')).toBe('Unknown');
    expect(parseEffectiveness('test')).toBe('Unknown');

    expect(parseEffectiveness(NaN)).toBe('Unknown');
  });
})