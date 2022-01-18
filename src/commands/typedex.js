const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { capitalize, colors, language, typematchups } = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(language.lookup('command.typedex.name', 'de'))
		.setDescription(language.lookup('command.typedex.description', 'de'))
		.addStringOption(option =>
			option.setName(language.lookup('option.type.attacking', 'de'))
				.setDescription(language.lookup('option.type.description', 'de'))
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName(language.lookup('option.type.defending', 'de'))
				.setDescription(language.lookup('option.type.description', 'de'))
				.setRequired(false),
		),
	async execute(interaction) {
		await interaction.deferReply();

		const attackingType = interaction.options.getString(language.lookup('option.type.attacking', 'de'));
		const attackingTypeEN = language.translate(attackingType.toLowerCase(), 'de', 'en');

		const defendingType = interaction.options.getString(language.lookup('option.type.defending', 'de'));
		if (defendingType) {
			const defendingTypeEN = language.translate(defendingType.toLowerCase(), 'de', 'en');
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

		const effectiveFieldValue = effectiveMatchups.map(formatMatchup).join('\r\n');
		embed.fields.push({ name: language.lookup('pokemon.effectiveness.veryeffective', 'de'), value: effectiveFieldValue });

		const notEffectiveFieldValue = notEffectiveMatchups.map(formatMatchup).join('\r\n');
		embed.fields.push({ name: language.lookup('pokemon.effectiveness.notveryeffective', 'de'), value: notEffectiveFieldValue });

		await interaction.editReply({ embeds: [embed] });
	},
};

function parseEffectiveness(effectiveness) {
	switch (effectiveness) {
	case 0:
		return language.lookup('pokemon.effectiveness.noeffect', 'de');
	case 0.50:
		return language.lookup('pokemon.effectiveness.notveryeffective', 'de');
	case 1:
		return language.lookup('pokemon.effectiveness.effective', 'de');
	case 2:
		return language.lookup('pokemon.effectiveness.veryeffective', 'de');
	default:
		return language.lookup('pokemon.effectiveness.unknown', 'de');
	}
}

function formatMatchup(matchup) {
	const type = capitalize(language.lookup(`pokemon.types.${matchup[0]}`, 'de'));
	const effectiveness = parseEffectiveness(matchup[1]);

	return `${type}: ${effectiveness}`;
}