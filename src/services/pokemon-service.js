const fetch = require('node-fetch');

module.exports.getPokemon = async function(name) {
	const response = await fetch(`${process.env.API_URL}/pokemon?name=${name}`);
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return await response.json();
};

module.exports.getRandomPokemon = async function() {
	const index = getRandomArbitrary(898);
	const response = await fetch(`${process.env.API_URL}/pokemon/${index}`);
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return await response.json();
};

module.exports.getType = async function(name) {
	const response = await fetch(`${process.env.API_URL}/types?name=${name}`);
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return await response.json();
};

module.exports.getRandomType = async function() {
	const index = getRandomArbitrary(18);
	const response = await fetch(`${process.env.API_URL}/types/${index}`);
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return await response.json();
};

function getRandomArbitrary(max) {
	return Math.floor(Math.random() * (max - 1 + 1)) + 1;
}