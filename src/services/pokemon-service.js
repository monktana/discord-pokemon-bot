const fetch = require('node-fetch');

module.exports.getPokemon = async function(name) {
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return await response.json();
};