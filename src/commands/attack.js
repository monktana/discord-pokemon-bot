const util = require('util');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { parseEffectiveness, Language } = require('../utils/utils');
const PokemonService = require('../services/pokemon-service');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.attack.name'))
		.setDescription(Language.lookup('command.attack.description'))
		.addStringOption(option => option.setName(Language.lookup('option.pokemon.name'))
			.setDescription(Language.lookup('option.pokemon.description'))
			.setRequired(true),
		)
		.addStringOption(option => option.setName(Language.lookup('option.type.first'))
			.setDescription(Language.lookup('option.type.description'))
			.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const pokemonParameter = interaction.options.getString(Language.lookup('option.pokemon.name'), true);
		const typeParameter = interaction.options.getString(Language.lookup('option.type.first'), true);

		const pokemon = (await PokemonService.getPokemon(pokemonParameter.toLowerCase())).results[0];
		const type = (await PokemonService.getType(typeParameter.toLowerCase())).results[0];

		const effectiveness = type.matchups.reduce((accumulator, matchup) => {
			if (!pokemon.types.some((pokemonType) => pokemonType.name === matchup.name)) {
				return accumulator;
			}

			return accumulator *= matchup.matchup.effectiveness;
		}, 1);

		const reply = util.format(Language.lookup('command.attack.answer'), pokemon.name, type.name, parseEffectiveness(effectiveness), effectiveness);

		await interaction.editReply({ content: reply });
	},
};