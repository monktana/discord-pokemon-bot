const pokemon = require('../languages/pokemon');

module.exports.translate = function(name, target = 'en') {
	return pokemon[name][target];
};