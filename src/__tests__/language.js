const Language = require('./../utils/language');
const { LanguageError } = require('./../errors/languageError');

describe('translator object is a singleton', () => {
  it('generates only one translator object', async () => {
    const first = Language.getTranslator();
    const second = Language.getTranslator();

    expect(first).toBe(second);
  });
});

describe('translator contains multiple languages', () => {
  it('contains two languages', async () => {
    const translator = Language.getTranslator();
    const languages = Object.keys(translator);

    expect(languages.length).toBe(2);

    expect(languages).toContain('en');
    expect(languages).toContain('de');
  });

  it('allows to check if a language is supported', async () => {
    expect(Language.isSupported('en')).toBe(true);
    expect(Language.isSupported('es')).toBe(false);
  });
});

describe('access different messages through keys', () => {
  it('accesses english messages per default', async () => {
    const message = Language.lookup('pokemon.name.bulbasaur');

    expect(message).toBe('bulbasaur');
    expect(message).not.toBe('bisasam');
  });

  it('gives access to different messages through keys', async () => {
    const messageOne = Language.lookup('pokemon.name.bulbasaur');
    const messageTwo = Language.lookup('types.pokemon.count');

    expect(messageOne).toBe('bulbasaur');
    expect(messageTwo).toContain('Pokémon with this type');
  });

  it('gives acces to different languages through the same key', async () => {
    const messageOne = Language.lookup('pokemon.name.bulbasaur', 'en');
    const messageTwo = Language.lookup('pokemon.name.bulbasaur', 'de');

    expect(messageOne).toBe('bulbasaur');
    expect(messageOne).not.toBe('bisasam');

    expect(messageTwo).toBe('bisasam');
    expect(messageTwo).not.toBe('bulbasaur');
  });

  it('throws an error when accessing an undefined language', async () => {
    expect.assertions(1);

    try {
      Language.lookup('pokemon.name.bulbasaur', 'es');
    } catch (error) {
      expect(error).toBeInstanceOf(LanguageError);
    }
  });

  it('throws an error when accessing an undefined key', async () => {
    expect.assertions(1);

    try {
      Language.lookup('pokemon.name.test', 'en');
    } catch (error) {
      expect(error).toBeInstanceOf(LanguageError);
    }
  });
});