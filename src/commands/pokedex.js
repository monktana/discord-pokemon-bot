const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service.js');
const colors = require('../utils/colors');
const LanguageManager = require('../utils/translate.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokedex')
		.setDescription('Shows the pokédex entry of a pokémon.')
		.addStringOption(option =>
			option.setName('pokemon')
				.setDescription('Name of the pokémon')
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();

		const pokemon = interaction.options.getString('pokemon');
		const searchTerm = LanguageManager.translate(pokemon.toLowerCase());

		const { height, weight, name, types, stats, sprites } = await PokemonService.getPokemon(searchTerm);
		const color = types[0].type.name;

		const embed = new MessageEmbed()
			.setColor(colors[color])
			.setTitle(pokemon)
			.setThumbnail(sprites.front_default)
			.addFields(
				{ name: 'Height', value: `${height}`, inline: true },
				{ name: 'Weight', value: `${weight}`, inline: true },
				{ name: 'Types', value: types.map(type => type.type.name).join(', ') },
				{ name: 'Base stats', value: stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join('\r\n') },
			);
		await interaction.editReply({ embeds: [embed] });
	},
};