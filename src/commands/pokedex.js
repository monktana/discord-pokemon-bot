const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service');
const { capitalize, parseEffectiveness, TypeColors, Language, TypeMatrix } = require('../utils/utils');

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

		const pokemon = (await PokemonService.getPokemon(searchTerm)).results[0];
		const matchups = Object.entries(TypeMatrix).map((attackingType) => {
			const [attackingTypeName, defendingTypes] = attackingType;
			let effectiveness = 1;

			for (let index = 0; index < pokemon.types.length; index += 1) {
				const typeOfPokemon = pokemon.types[index];
				effectiveness *= defendingTypes[typeOfPokemon.name];
			}

			return { name: attackingTypeName, matchup: { effectiveness } };
		});

		const color = pokemon.types[0].name;

		const embed = new MessageEmbed({
			color: TypeColors[color],
			title: capitalize(pokemon.name),
			fields: [
				{ name: Language.lookup('pokemon.pokedex.id', 'en'), value: `${pokemon.id}` },
				{ name: Language.lookup('pokemon.pokedex.entry', 'en'), value: `${pokemon.pokedexEntry}` },
				{ name: Language.lookup('pokemon.stats.height', 'en'), value: `${pokemon.height}`, inline: true },
				{ name: Language.lookup('pokemon.stats.weight', 'en'), value: `${pokemon.weight}`, inline: true },
				{ name: Language.lookup('pokemon.types.types', 'en'), value: this.formatTypes(pokemon.types) },
				{ name: Language.lookup('pokemon.effectiveness.defenses', 'en'), value: this.formatMatchups(matchups) },
			],
		});

		return interaction.editReply({ embeds: [embed] });
	},

	formatMatchups(matchups) {
		return matchups.reduce((accumulator, matchup) => {
			return `${accumulator}${capitalize(Language.lookup(`pokemon.types.${matchup.name}`, 'en'))}: ${parseEffectiveness(matchup.matchup.effectiveness)} (${matchup.matchup.effectiveness}x)\n`;
		}, '');
	},

	formatTypes(types) {
		return types.map(type => {
			return capitalize(Language.lookup(`pokemon.types.${type.name}`, 'en'));
		}).join(', ');
	},
};