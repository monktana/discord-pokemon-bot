const typematchups = require('./typematchups');
const colors = require('./colors');
const language = require('./language');

module.exports.capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.typematchups = typematchups;
module.exports.colors = colors;
module.exports.language = language;
