const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { capitalize, colors, language, typematchups } = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(language.lookup('command.typedex.name', 'en'))
		.setDescription(language.lookup('command.typedex.description', 'en'))
		.addStringOption(option =>
			option.setName(language.lookup('option.type.attacking', 'en'))
				.setDescription(language.lookup('option.type.description', 'en'))
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName(language.lookup('option.type.defending', 'en'))
				.setDescription(language.lookup('option.type.description', 'en'))
				.setRequired(false),
		),
	async execute(interaction) {
		await interaction.deferReply();

		const attackingType = interaction.options.getString(language.lookup('option.type.attacking', 'en'));
		const attackingTypeEN = language.translate(attackingType.toLowerCase(), 'en', 'en');

		const defendingType = interaction.options.getString(language.lookup('option.type.defending', 'en'));
		if (defendingType) {
			const defendingTypeEN = language.translate(defendingType.toLowerCase(), 'en', 'en');
			const effectiveness = typematchups[attackingTypeEN][defendingTypeEN];

			return await interaction.editReply(parseEffectiveness(effectiveness));
		}

		const matchups = Object.entries(typematchups[attackingTypeEN]);
		const effectiveMatchups = matchups.filter(matchup => matchup[1] > 1);
		const notEffectiveMatchups = matchups.filter(matchup => matchup[1] < 1);

		const embed = new MessageEmbed({
			color: colors[attackingTypeEN],
			title: capitalize(attackingType),
			fields: [],
		});

		const effectiveFieldValue = effectiveMatchups.map(this.formatMatchup).join('\r\n');
		embed.fields.push({ name: language.lookup('pokemon.effectiveness.veryeffective', 'en'), value: effectiveFieldValue });

		const notEffectiveFieldValue = notEffectiveMatchups.map(this.formatMatchup).join('\r\n');
		embed.fields.push({ name: language.lookup('pokemon.effectiveness.notveryeffective', 'en'), value: notEffectiveFieldValue });

		await interaction.editReply({ embeds: [embed] });
	},

	parseEffectiveness(effectiveness) {
		switch (effectiveness) {
		case 0:
			return language.lookup('pokemon.effectiveness.noeffect', 'en');
		case 0.50:
			return language.lookup('pokemon.effectiveness.notveryeffective', 'en');
		case 1:
			return language.lookup('pokemon.effectiveness.effective', 'en');
		case 2:
			return language.lookup('pokemon.effectiveness.veryeffective', 'en');
		default:
			return language.lookup('pokemon.effectiveness.unknown', 'en');
		}
	},
	
	formatMatchup(matchup) {
		const type = capitalize(language.lookup(`pokemon.types.${matchup[0]}`, 'en'));
		const effectiveness = this.parseEffectiveness(matchup[1]);
	
		return `${type}: ${effectiveness}`;
	}
};