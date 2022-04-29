const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const util = require('util');
const Util = require('../utils/utils');
const PokemonService = require('../services/pokemon-service');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Util.Language.lookup('command.typedex.name', 'en'))
		.setDescription(Util.Language.lookup('command.typedex.description', 'en'))
		.addStringOption(option => option.setName(Util.Language.lookup('option.type.first', 'en'))
			.setDescription(Util.Language.lookup('option.type.description', 'en'))
			.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const parameter = interaction.options.getString(Util.Language.lookup('option.type.first', 'en'), true);
		const searchTerm = parameter.toLowerCase();

		const type = (await PokemonService.getType(searchTerm)).results[0];
		if (type == null) {
			const response = util.format(Util.Language.lookup('command.typedex.notfound', 'en'), searchTerm);
			return interaction.editReply(response);
		}

		const veryEffectiveTypes = Util.filterSuperEffectiveMatchups(type.matchups).map(this.formatMatchup).join(', ');
		const notEffectiveTypes = Util.filterNotEffectiveMatchups(type.matchups).map(this.formatMatchup).join(', ');
		const noEffectTypes = Util.filterNoEffectMatchups(type.matchups).map(this.formatMatchup).join(', ');

		const embed = new MessageEmbed({
			color: Util.TypeColors[type.name],
			title: Util.capitalize(type.name),
			fields: [
				{ name: Util.Language.lookup('types.pokemon.count', 'en'), value: `${type.pokemon.length}` },
				{ name: Util.Language.lookup('pokemon.effectiveness.supereffective', 'en'), value: veryEffectiveTypes || Util.Language.lookup('pokemon.effectiveness.none', 'en') },
				{ name: Util.Language.lookup('pokemon.effectiveness.notveryeffective', 'en'), value: notEffectiveTypes || Util.Language.lookup('pokemon.effectiveness.none', 'en') },
				{ name: Util.Language.lookup('pokemon.effectiveness.noeffect', 'en'), value: noEffectTypes || Util.Language.lookup('pokemon.effectiveness.none', 'en') },
			],
		});

		await interaction.editReply({ embeds: [embed] });
	},

	formatMatchup(matchup) {
		return `${Util.capitalize(Util.Language.lookup(`pokemon.types.${matchup.name}`, 'en'))} (${matchup.matchup.effectiveness}x)`;
	},
};