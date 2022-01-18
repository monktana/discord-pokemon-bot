const fs = require('fs');

let translator = null;

module.exports.isSupported = function(targetLanguage) {
	return this.getTranslator().keys().includes(targetLanguage);
};

module.exports.lookup = function(key, targetLanguage) {
	return this.getTranslator()[targetLanguage][key];
};

module.exports.translate = function(term, sourceLanguage, targetLanguage) {
	const source = this.getTranslator()[sourceLanguage];
	const termKey = Object.entries(source).find(entry => entry[1] == term)[0];

	return this.lookup(termKey, targetLanguage);
};

module.exports.getTranslator = function() {
	if (translator) {
		return translator;
	}

	translator = {};
	const languageFiles = fs.readdirSync('./src/languages').filter(file => file.endsWith('.json'));

	for (const file of languageFiles) {
		const language = JSON.parse(fs.readFileSync(`./src/languages/${file}`));
		const languageKey = file.replace('.json', '');

		translator[languageKey] = language;
	}

	return translator;
};