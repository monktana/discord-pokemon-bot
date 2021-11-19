const messages = require('../languages/core');
const pokemon = require('../languages/pokemon');

module.exports.translate = function(name, target = 'en') {
	return pokemon[name][target];
};

module.exports.get = function(key, target = 'de') {
	return messages[key][target];
};