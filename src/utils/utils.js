const fs = require('fs');

let translator = null;

module.exports.capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.getTranslator = function() {
	if (translator) {
		return translator
	}
 
	translator = {}
	const languageFiles = fs.readdirSync('./src/languages').filter(file => file.endsWith('.json'));

	for (const file of languageFiles) {
		const language = JSON.parse(fs.readFileSync(`./src/languages/${file}`));
		const languageKey = file.replace('.json', '');

		translator[languageKey] = language;
	}

	return translator;
}

module.exports.lookup = function (key, targetLanguage) {
	// todo
}

module.exports.translate = function (term, sourceLanguage, targetLanguage) {
	// todo
}