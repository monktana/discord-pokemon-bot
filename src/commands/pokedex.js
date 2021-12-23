const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service');
const colors = require('../utils/colors');
const utils = require('../utils/utils');
const language = require('../utils/language');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(language.lookup('command.pokedex.name', 'de'))
		.setDescription(language.lookup('command.pokedex.description', 'de'))
		.addStringOption(option =>
			option.setName(language.lookup('option.pokemon.name', 'de'))
				.setDescription(language.lookup('option.pokemon.description', 'de'))
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();

		const pokemon = interaction.options.getString(language.lookup('option.pokemon.name', 'de')).toLowerCase();
		const searchTerm = language.translate(pokemon, 'de', 'en');

		try {
			const pokemonData = await PokemonService.getPokemon(searchTerm);
			const { height, weight, types, stats, sprites } = pokemonData;
			const color = types[0].type.name;

			const embed = new MessageEmbed({
				color: colors[color],
				title: utils.capitalize(pokemon),
				thumbnail: { url: sprites.front_default },
				fields: [
					{ name: language.lookup('pokemon.stats.height','de'), value: `${height}`, inline: true },
					{ name: language.lookup('pokemon.stats.weight','de'), value: `${weight}`, inline: true },
					{ name: language.lookup('pokemon.types.types','de'), value: types.map(type => utils.capitalize(language.lookup(`pokemon.types.${type.type.name}`,'de'))).join(', ') },
					{ name: language.lookup('pokemon.stats.base','de'), value: stats.map(stat => language.lookup(`pokemon.stats.${stat.stat.name}`,'de') + `: ${stat.base_stat}`).join('\r\n') },
				],
			});

			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			return interaction.editReply(language.lookup('command.pokedex.error','de'));
		}
	},
};