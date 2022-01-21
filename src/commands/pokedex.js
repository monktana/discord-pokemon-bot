const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service');
const { capitalize, Colors, Language } = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.pokedex.name', 'en'))
		.setDescription(Language.lookup('command.pokedex.description', 'en'))
		.addStringOption(option =>
			option.setName(Language.lookup('option.pokemon.name', 'en'))
				.setDescription(Language.lookup('option.pokemon.description', 'en'))
				.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const parameter = interaction.options.getString(Language.lookup('option.pokemon.name', 'en'), true);
		const searchTerm = parameter.toLowerCase();

		const pokemonData = await PokemonService.getPokemon(searchTerm);
		const pokemon = pokemonData;
		const color = pokemon.types[0].name;
		const colorCode = this.getColorCode(color);

		const embed = new MessageEmbed({
			color: colorCode,
			title: capitalize(pokemon.name),
			fields: [
				{ name: Language.lookup('pokemon.stats.height', 'en'), value: `${pokemon.height}`, inline: true },
				{ name: Language.lookup('pokemon.stats.weight', 'en'), value: `${pokemon.weight}`, inline: true },
				{ name: Language.lookup('pokemon.types.types', 'en'), value: this.formatTypes(pokemon.types) },
				{ name: Language.lookup('pokemon.stats.base', 'en'), value: this.formatStats(pokemon.stats) },
			],
		});

		return interaction.editReply({ embeds: [embed] });
	},

	getColorCode(colorKey) {
		return Colors.TypeColors[colorKey];
	},

	formatTypes(types) {
		return types.map(type => {
			return capitalize(Language.lookup(`pokemon.types.${type.name}`, 'en'));
		}).join(', ');
	},

	formatStats(stats) {
		return stats.map(stat => {
			return Language.lookup(`pokemon.stats.${stat.name}`, 'en') + `: ${stat.base_stat}`;
		}).join('\r\n');
	},
};