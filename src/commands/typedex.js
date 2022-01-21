const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { capitalize, Colors, Language, typematchups } = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.typedex.name', 'en'))
		.setDescription(Language.lookup('command.typedex.description', 'en'))
		.addStringOption(option =>
			option.setName(Language.lookup('option.type.attacking', 'en'))
				.setDescription(Language.lookup('option.type.description', 'en'))
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName(Language.lookup('option.type.defending', 'en'))
				.setDescription(Language.lookup('option.type.description', 'en'))
				.setRequired(false),
		),
	async execute(interaction) {
		await interaction.deferReply();

		const attackingType = interaction.options.getString(Language.lookup('option.type.attacking', 'en'));
		const defendingType = interaction.options.getString(Language.lookup('option.type.defending', 'en'));

		if (defendingType) {
			const effectiveness = typematchups[attackingType][defendingType];

			return await interaction.editReply(this.parseEffectiveness(effectiveness));
		}

		const matchups = Object.entries(typematchups[attackingType]);
		const effectiveMatchups = matchups.filter(matchup => matchup[1] > 1);
		const notEffectiveMatchups = matchups.filter(matchup => matchup[1] < 1);

		const embed = new MessageEmbed({
			color: Colors[attackingType],
			title: capitalize(attackingType),
			fields: [],
		});

		const effectiveFieldValue = effectiveMatchups.map(this.formatMatchup).join('\r\n');
		embed.fields.push({ name: Language.lookup('pokemon.effectiveness.veryeffective', 'en'), value: effectiveFieldValue });

		const notEffectiveFieldValue = notEffectiveMatchups.map(this.formatMatchup).join('\r\n');
		embed.fields.push({ name: Language.lookup('pokemon.effectiveness.notveryeffective', 'en'), value: notEffectiveFieldValue });

		await interaction.editReply({ embeds: [embed] });
	},

	parseEffectiveness(effectiveness) {
		switch (effectiveness) {
		case 0:
			return Language.lookup('pokemon.effectiveness.noeffect', 'en');
		case 0.50:
			return Language.lookup('pokemon.effectiveness.notveryeffective', 'en');
		case 1:
			return Language.lookup('pokemon.effectiveness.effective', 'en');
		case 2:
			return Language.lookup('pokemon.effectiveness.veryeffective', 'en');
		default:
			return Language.lookup('pokemon.effectiveness.unknown', 'en');
		}
	},

	formatMatchup(matchup) {
		const type = capitalize(Language.lookup(`pokemon.types.${matchup[0]}`, 'en'));
		const effectiveness = this.parseEffectiveness(matchup[1]);

		return `${type}: ${effectiveness}`;
	},
};