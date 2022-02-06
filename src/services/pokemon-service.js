const fetch = require('node-fetch');

module.exports.getPokemon = async function(name) {
	const response = await fetch(`http://localhost:5000/pokemon?name=${name}`);
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return await response.json();
};

module.exports.getType = async function(name) {
	const response = await fetch(`http://localhost:5000/types?name=${name}`);
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return await response.json();
};