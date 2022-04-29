const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const util = require('util');
const PokemonService = require('../services/pokemon-service');
const Util = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Util.Language.lookup('command.pokedex.name', 'en'))
		.setDescription(Util.Language.lookup('command.pokedex.description', 'en'))
		.addStringOption(option =>
			option.setName(Util.Language.lookup('option.pokemon.name', 'en'))
				.setDescription(Util.Language.lookup('option.pokemon.description', 'en'))
				.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const parameter = interaction.options.getString(Util.Language.lookup('option.pokemon.name', 'en'), true);
		const searchTerm = parameter.toLowerCase();

		const pokemon = (await PokemonService.getPokemon(searchTerm)).results[0];
		if (pokemon == null) {
			const response = util.format(Util.Language.lookup('command.pokedex.notfound', 'en'), searchTerm);
			return interaction.editReply(response);
		}

		const matchups = Object.entries(Util.TypeMatrix).map((attackingType) => {
			const [attackingTypeName, defendingTypes] = attackingType;
			let effectiveness = 1;

			for (let index = 0; index < pokemon.types.length; index += 1) {
				const typeOfPokemon = pokemon.types[index];
				effectiveness *= defendingTypes[typeOfPokemon.name];
			}

			return { name: attackingTypeName, matchup: { effectiveness } };
		});

		const veryEffectiveTypes = Util.filterSuperEffectiveMatchups(matchups).map(this.formatMatchup).join(', ');
		const notEffectiveTypes = Util.filterNotEffectiveMatchups(matchups).map(this.formatMatchup).join(', ');
		const noEffectTypes = Util.filterNoEffectMatchups(matchups).map(this.formatMatchup).join(', ');

		const color = pokemon.types[0].name;

		const embed = new MessageEmbed({
			color: Util.TypeColors[color],
			title: Util.capitalize(pokemon.name),
			fields: [
				{ name: Util.Language.lookup('pokemon.pokedex.id', 'en'), value: `${pokemon.id}` },
				{ name: Util.Language.lookup('pokemon.pokedex.entry', 'en'), value: `${pokemon.pokedexEntry}` },
				{ name: Util.Language.lookup('pokemon.stats.height', 'en'), value: `${pokemon.height}`, inline: true },
				{ name: Util.Language.lookup('pokemon.stats.weight', 'en'), value: `${pokemon.weight}`, inline: true },
				{ name: Util.Language.lookup('pokemon.types.types', 'en'), value: this.formatTypes(pokemon.types) },
				{ name: Util.Language.lookup('pokemon.effectiveness.defenses', 'en'), value: '\u200B' },
				{ name: Util.Language.lookup('pokemon.effectiveness.supereffective', 'en'), value: veryEffectiveTypes || Util.Language.lookup('pokemon.effectiveness.none', 'en') },
				{ name: Util.Language.lookup('pokemon.effectiveness.notveryeffective', 'en'), value: notEffectiveTypes || Util.Language.lookup('pokemon.effectiveness.none', 'en') },
				{ name: Util.Language.lookup('pokemon.effectiveness.noeffect', 'en'), value: noEffectTypes || Util.Language.lookup('pokemon.effectiveness.none', 'en') },
			],
		});

		return interaction.editReply({ embeds: [embed] });
	},

	formatMatchup(matchup) {
		return `${Util.capitalize(Util.Language.lookup(`pokemon.types.${matchup.name}`, 'en'))} (${matchup.matchup.effectiveness}x)`;
	},

	formatTypes(types) {
		return types.map(type => Util.capitalize(Util.Language.lookup(`pokemon.types.${type.name}`, 'en'))).join(', ');
	},
};