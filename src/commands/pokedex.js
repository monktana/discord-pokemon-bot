const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service');
const { capitalize, colors, language } = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(language.lookup('command.pokedex.name', 'en'))
		.setDescription(language.lookup('command.pokedex.description', 'en'))
		.addStringOption(option =>
			option.setName(language.lookup('option.pokemon.name', 'en'))
				.setDescription(language.lookup('option.pokemon.description', 'en'))
				.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const pokemon = interaction.options.getString(language.lookup('option.pokemon.name', 'en'));
		let searchTerm = pokemon.toLowerCase();

		const pokemonData = await PokemonService.getPokemon(searchTerm);
		const { name, height, weight, types, stats } = pokemonData;
		const color = types[0].name;

		const embed = new MessageEmbed({
			color: colors[color],
			title: capitalize(name),
			fields: [
				{ name: language.lookup('pokemon.stats.height', 'en'), value: `${height}`, inline: true },
				{ name: language.lookup('pokemon.stats.weight', 'en'), value: `${weight}`, inline: true },
				{ name: language.lookup('pokemon.types.types', 'en'), value: this.formatTypes(types) },
				{ name: language.lookup('pokemon.stats.base', 'en'), value: this.formatStats(stats) },
			],
		});

		return interaction.editReply({ embeds: [embed] });
	},

	formatTypes(types) {
		return types.map(type => {
			return capitalize(language.lookup(`pokemon.types.${type.name}`, 'en'));
		}).join(', ');
	},
	
	formatStats(stats) {
		return stats.map(stat => {
			return language.lookup(`pokemon.stats.${stat.name}`, 'en') + `: ${stat.base_stat}`;
		}).join('\r\n');
	},
};