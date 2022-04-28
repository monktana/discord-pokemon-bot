const TypeColors = require('./colors');
const TypeMatrix = require('./typematchups');
const Language = require('./language');

module.exports.capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.calculateEffectiveness = function(attackingType, defendingTypes) {
	return attackingType.matchups.reduce((accumulator, matchup) => {
		if (!defendingTypes.some((defendingType) => defendingType.name === matchup.name)) {
			return accumulator;
		}

		return accumulator *= matchup.matchup.effectiveness;
	}, 1);
},

module.exports.parseEffectiveness = function(effectiveness) {
	switch (effectiveness) {
	case 0:
		return Language.lookup('pokemon.effectiveness.noeffect', 'en');
	case 0.25:
	case 0.50:
		return Language.lookup('pokemon.effectiveness.notveryeffective', 'en');
	case 1:
		return Language.lookup('pokemon.effectiveness.effective', 'en');
	case 2:
	case 4:
		return Language.lookup('pokemon.effectiveness.supereffective', 'en');
	default:
		return Language.lookup('pokemon.effectiveness.unknown', 'en');
	}
},

module.exports.filterSuperEffectiveMatchups = function(matchups) {
	return matchups.filter(matchup => matchup.matchup.effectiveness >= 2);
},

module.exports.filterEffectiveMatchups = function(matchups) {
	return matchups.filter(matchup => matchup.matchup.effectiveness === 1);
},

module.exports.filterNotEffectiveMatchups = function(matchups) {
	return matchups.filter(matchup => matchup.matchup.effectiveness > 0 && matchup.matchup.effectiveness < 1);
},

module.exports.filterNoEffectMatchups = function(matchups) {
	return matchups.filter(matchup => matchup.matchup.effectiveness === 0);
},

module.exports.TypeColors = TypeColors;
module.exports.TypeMatrix = TypeMatrix;
module.exports.Language = Language;
