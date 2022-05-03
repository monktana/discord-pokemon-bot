const fs = require('fs');
const { LanguageError } = require('../errors/languageError');

let translator = null;

module.exports.isSupported = function(targetLanguage) {
	return Object.keys(this.getTranslator()).includes(targetLanguage);
};

module.exports.lookup = function(key, targetLanguage = 'en') {
	if (!this.isSupported(targetLanguage)) {
		throw new LanguageError(`Language '${targetLanguage}' is currently unsupported`);
	}

	const message = (this.getTranslator())[targetLanguage][key];
	if (!message) {
		throw new LanguageError(`No message found for '${key}' under language '${targetLanguage}'`);
	}
	
	return message;
};

module.exports.getTranslator = function() {
	if (translator) {
		return translator;
	}

	try {
		translator = {};
		const languageFiles = fs.readdirSync('./src/languages').filter(file => file.endsWith('.json'));

		for (const file of languageFiles) {
			const fileContent = fs.readFileSync(`./src/languages/${file}`).toString();
			const language = JSON.parse(fileContent);
			const languageKey = file.replace('.json', '');

			translator[languageKey] = language;
		}

		return translator;
	}
	catch (error) {
		throw new LanguageError(`Failed to setup translator: ${error}`);
	}
};
