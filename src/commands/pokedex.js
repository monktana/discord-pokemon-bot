const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service.js');
const colors = require('../utils/colors');
const utils = require('../utils/utils.js');

const { de, en } = utils.getTranslator();

module.exports = {
	data: new SlashCommandBuilder()
		.setName(de['command.pokedex.name'].toLowerCase())
		.setDescription(de['command.pokedex.description'])
		.addStringOption(option =>
			option.setName(de['option.pokemon.name'])
				.setDescription(de['option.pokemon.description'])
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();

		const pokemon = interaction.options.getString(de['option.pokemon.name']);
		const searchTerm = Object.entries(de).find(entry => entry[1] == pokemon)[0]

		const { height, weight, types, stats, sprites } = await PokemonService.getPokemon(en[searchTerm]);
		const color = types[0].type.name;

		const embed = new MessageEmbed({
			color: colors[color],
			title: utils.capitalize(pokemon),
			thumbnail: { url: sprites.front_default },
			fields: [
				{ name: de['pokemon.stats.height'], value: `${height}`, inline: true },
				{ name: de['pokemon.stats.weight'], value: `${weight}`, inline: true },
				{ name: de['pokemon.types.types'], value: types.map(type => de[`pokemon.types.${type.type.name}`]).join(', ') },
				{ name: de['pokemon.stats.base'], value: stats.map(stat => de[`pokemon.stats.${stat.stat.name}`] + `: ${stat.base_stat}`).join('\r\n') },
			],
		});

		await interaction.editReply({ embeds: [embed] });
	},
};