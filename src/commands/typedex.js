const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { capitalize, TypeColors, Language, Typematchups } = require('../utils/utils');

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
		await this.executeTypeSubcommand(interaction);
	},

	async executeTypeSubcommand(interaction) {
		const parameter = interaction.options.getString(Language.lookup('option.type.first'), true);
		const searchTerm = parameter.toLowerCase();

		const matchups = Object.entries(Typematchups[searchTerm]);
		const veryEffectiveMatchups = matchups.filter(matchup => matchup[1] > 1);
		const notEffectiveMatchups = matchups.filter(matchup => matchup[1] < 1);

		const embed = new MessageEmbed({
			color: TypeColors[searchTerm],
			title: capitalize(searchTerm),
			fields: [],
		});

		const veryEffectiveFieldValue = veryEffectiveMatchups.map(this.formatMatchup).join(', ');
		embed.fields.push({ 
			name: '✅ ' + Language.lookup('pokemon.effectiveness.veryeffective'), 
			value: veryEffectiveFieldValue
		});

		const notEffectiveFieldValue = notEffectiveMatchups.map(this.formatMatchup).join(', ');
		embed.fields.push({ 
			name: '❌ ' + Language.lookup('pokemon.effectiveness.notveryeffective'), 
			value: notEffectiveFieldValue
		});

		await interaction.editReply({ embeds: [embed] });
	},

	formatMatchup(matchup) {
		return capitalize(Language.lookup(`pokemon.types.${matchup[0]}`));
	},
};