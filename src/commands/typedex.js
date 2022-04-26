const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { capitalize, TypeColors, Language } = require('../utils/utils');
const PokemonService = require('../services/pokemon-service');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.typedex.name', 'en'))
		.setDescription(Language.lookup('command.typedex.description', 'en'))
		.addStringOption(option => option.setName(Language.lookup('option.type.first', 'en'))
			.setDescription(Language.lookup('option.type.description', 'en'))
			.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const parameter = interaction.options.getString(Language.lookup('option.type.first', 'en'), true);
		const searchTerm = parameter.toLowerCase();

		const type = (await PokemonService.getType(searchTerm)).results[0];

		const embed = new MessageEmbed({
			color: TypeColors[type.name],
			title: capitalize(type.name),
			fields: [
				{ name: Language.lookup('types.pokemon.count', 'en'), value: `${type.pokemon.length}` },
			],
		});

		const veryEffectiveTypes = type.matchups.filter(matchup => matchup.matchup.effectiveness >= 2).map(this.formatMatchup).join(', ');
		embed.fields.push({
			name: Language.lookup('pokemon.effectiveness.supereffective', 'en'),
			value: veryEffectiveTypes || Language.lookup('pokemon.effectiveness.none', 'en'),
		});

		const notEffectiveTypes = type.matchups.filter(matchup => (matchup.matchup.effectiveness > 0 && matchup.matchup.effectiveness < 1)).map(this.formatMatchup).join(', ');
		embed.fields.push({
			name: Language.lookup('pokemon.effectiveness.notveryeffective', 'en'),
			value: notEffectiveTypes || Language.lookup('pokemon.effectiveness.none', 'en'),
		});

		const noEffectTypes = type.matchups.filter(matchup => matchup.matchup.effectiveness === 0).map(this.formatMatchup).join(', ');
		embed.fields.push({
			name: Language.lookup('pokemon.effectiveness.noeffect', 'en'),
			value: noEffectTypes || Language.lookup('pokemon.effectiveness.none', 'en'),
		});

		await interaction.editReply({ embeds: [embed] });
	},

	formatMatchup(matchup) {
		return `${capitalize(Language.lookup(`pokemon.types.${matchup.name}`, 'en'))} (${matchup.matchup.effectiveness}x)`;
	},
};