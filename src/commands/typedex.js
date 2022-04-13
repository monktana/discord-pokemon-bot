const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { capitalize, TypeColors, Language } = require('../utils/utils');
const PokemonService = require('../services/pokemon-service');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.typedex.name'))
		.setDescription(Language.lookup('command.typedex.description'))
		.addSubcommand(subcommand =>
			subcommand.setName(Language.lookup('subcommand.type.name'))
				.setDescription(Language.lookup('subcommand.type.description'))
				.addStringOption(option => option.setName(Language.lookup('option.type.first'))
					.setDescription(Language.lookup('option.type.description'))
					.setRequired(true)),
		),
	async execute(interaction) {
		await interaction.deferReply();
		await this.typeSubcommand(interaction);
	},

	async typeSubcommand(interaction) {
		const parameter = interaction.options.getString(Language.lookup('option.type.first'), true);
		const searchTerm = parameter.toLowerCase();

		const type = await PokemonService.getType(searchTerm).results[0];

		const embed = new MessageEmbed({
			color: TypeColors[type.name],
			title: capitalize(type.name),
			fields: [],
		});

		embed.fields.push({
			name: Language.lookup('types.pokemon.count'),
			value: `${type.pokemon.length}`,
		});

		const veryEffectiveTypes = type.matchups.filter(matchup => matchup.matchup.effectiveness >= 2).map(this.formatMatchup).join(', ');
		if (veryEffectiveTypes) {
			embed.fields.push({
				name: '✅ ' + Language.lookup('pokemon.effectiveness.veryeffective'),
				value: veryEffectiveTypes,
			});
		}

		const notEffectiveTypes = type.matchups.filter(matchup => (matchup.matchup.effectiveness > 0 && matchup.matchup.effectiveness < 1)).map(this.formatMatchup).join(', ');
		embed.fields.push({
			name: '❌ ' + Language.lookup('pokemon.effectiveness.notveryeffective'),
			value: notEffectiveTypes,
		});

		const noEffectTypes = type.matchups.filter(matchup => matchup.matchup.effectiveness === 0).map(this.formatMatchup).join(', ');
		if (noEffectTypes) {
			embed.fields.push({
				name: '🚫 ' + Language.lookup('pokemon.effectiveness.noeffect'),
				value: noEffectTypes,
			});
		}

		await interaction.editReply({ embeds: [embed] });
	},

	formatMatchup(matchup) {
		return capitalize(Language.lookup(`pokemon.types.${matchup.name}`));
	},
};