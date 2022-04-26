const util = require('util');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { calculateEffectiveness, parseEffectiveness, Language } = require('../utils/utils');
const PokemonService = require('../services/pokemon-service');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.attack.name', 'en'))
		.setDescription(Language.lookup('command.attack.description', 'en'))
		.addStringOption(option => option.setName(Language.lookup('option.pokemon.name', 'en'))
			.setDescription(Language.lookup('option.pokemon.description', 'en'))
			.setRequired(true),
		)
		.addStringOption(option => option.setName(Language.lookup('option.type.first', 'en'))
			.setDescription(Language.lookup('option.type.description', 'en'))
			.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const pokemonParameter = interaction.options.getString(Language.lookup('option.pokemon.name', 'en'), true);
		const typeParameter = interaction.options.getString(Language.lookup('option.type.first', 'en'), true);

		const pokemon = (await PokemonService.getPokemon(pokemonParameter.toLowerCase())).results[0];
		const type = (await PokemonService.getType(typeParameter.toLowerCase())).results[0];

		const effectiveness = calculateEffectiveness(type, pokemon.types);
		const effectivenessName = parseEffectiveness(effectiveness);

		const reply = util.format(Language.lookup('command.attack.answer', 'en'), pokemon.name, type.name, effectivenessName, effectiveness);

		await interaction.editReply({ content: reply });
	},
};