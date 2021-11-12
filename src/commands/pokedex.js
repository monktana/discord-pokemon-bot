const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service.js');

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

		const pkmn_name = interaction.options.getString('pokemon');
		const pokemon = await PokemonService.getPokemon(pkmn_name);
		const {height, weight, name, types, stats, sprites} = pokemon;

		const embed = new MessageEmbed()
			.setColor('#EFFF00')
			.setTitle(name)
			.setThumbnail(sprites.front_default)
			.addFields(
				{ name: 'Height', value: `${height}`, inline: true },
				{ name: 'Weight', value: `${weight}`, inline: true },
				{ name: 'Types', value: types.map(type => type.type.name).join(',') },
				{ name: 'Stats', value: stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join('\r\n') },
			);
		await interaction.editReply({ embeds: [embed] });
	},
};