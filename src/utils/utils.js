const Typematchups = require('./typematchups');
const TypeColors = require('./colors');
const Language = require('./language');

module.exports.capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.parseEffectiveness = function(effectiveness) {
	switch (effectiveness) {
	case 0:
		return Language.lookup('pokemon.effectiveness.noeffect', 'en');
	case 0.50:
		return Language.lookup('pokemon.effectiveness.notveryeffective', 'en');
	case 1:
		return Language.lookup('pokemon.effectiveness.effective', 'en');
	case 2:
		return Language.lookup('pokemon.effectiveness.veryeffective', 'en');
	default:
		return Language.lookup('pokemon.effectiveness.unknown', 'en');
	}
},

module.exports.TypeColors = TypeColors;
module.exports.Language = Language;
module.exports.Typematchups = Typematchups;
