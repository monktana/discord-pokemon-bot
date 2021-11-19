const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service.js');
const colors = require('../utils/colors');
const language = require('../utils/translate.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokedex')
		.setDescription(language.get('command_pokedex_description'))
		.addStringOption(option =>
			option.setName(language.get('option_pokemon_name'))
				.setDescription(language.get('option_pokemon_description'))
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();

		const pokemon = interaction.options.getString(language.get('option_pokemon_name'));
		const searchTerm = language.translate(pokemon.toLowerCase());

		const { height, weight, types, stats, sprites } = await PokemonService.getPokemon(searchTerm);
		const color = types[0].type.name;

		const embed = new MessageEmbed()
			.setColor(colors[color])
			.setTitle(pokemon)
			.setThumbnail(sprites.front_default)
			.addFields(
				{ name: language.get('height'), value: `${height}`, inline: true },
				{ name: language.get('weight'), value: `${weight}`, inline: true },
				{ name: language.get('types'), value: types.map(type => language.get(type.type.name)).join(', ') },
				{ name: language.get('base_stats'), value: stats.map(stat => `${language.get(stat.stat.name)}: ${stat.base_stat}`).join('\r\n') },
			);
		await interaction.editReply({ embeds: [embed] });
	},
};