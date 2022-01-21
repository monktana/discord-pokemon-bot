const Typematchups = require('./typematchups');
const Colors = require('./colors');
const Language = require('./language');

module.exports.capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.Colors = Colors;
module.exports.Language = Language;
module.exports.Typematchups = Typematchups;
