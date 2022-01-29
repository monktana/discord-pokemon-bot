const fetch = require('node-fetch');

module.exports.getPokemon = async function(name) {
	const response = await fetch(`http://localhost:5001/pokemon-api-d5ce5/us-central1/api/pokemon/${name}`);
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return await response.json();
};

module.exports.getType = async function(name) {
	const response = await fetch(`http://localhost:5001/pokemon-api-d5ce5/us-central1/api/types/${name}`);
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return await response.json();
};