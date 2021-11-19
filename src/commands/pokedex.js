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

		let pokemon = interaction.options.getString('pokemon').toLowerCase();
		pokemon = LanguageManager.translate(pokemon)

		const { height, weight, name, types, stats, sprites } = await PokemonService.getPokemon(pokemon);
		const type = types[0].type.name;

		const embed = new MessageEmbed()
			.setColor(colors[type])
			.setTitle(name)
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