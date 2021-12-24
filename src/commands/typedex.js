const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const utils = require('../utils/utils');
const language = require('../utils/language');
const colors = require('../utils/colors');
const typematchups = require('../utils/typematchups');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(language.lookup('command.typedex.name', 'de'))
		.setDescription(language.lookup('command.typedex.description', 'de'))
		.addStringOption(option =>
			option.setName(language.lookup('option.type.attacking', 'de'))
				.setDescription(language.lookup('option.type.description', 'de'))
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();

		let attackingType = interaction.options.getString(language.lookup('option.type.attacking', 'de'));
		// let defendingType = interaction.options.getString(language.lookup('option.type.defending', 'de'));

		attackingType = language.translate(attackingType, 'de', 'en');
		// defendingType = language.translate(defendingType, 'de', 'en');

		const matchups = Object.entries(typematchups[attackingType]);
		const veryeffective = matchups.filter(matchup => matchup[1] > 1);
		const noteffective = matchups.filter(matchup => matchup[1] < 1);
		// let reply = parseEffectiveness(effectiveness);

		const embed = new MessageEmbed({
			color: colors[attackingType],
			title: utils.capitalize(attackingType),
			fields: [],
		});
		
		embed.fields.push({ name: `sehr effektiv`, value: `\u200B`});
		for (const matchup of veryeffective) {
			embed.fields.push({ name: language.lookup(`pokemon.types.${matchup[0]}`,'de'), value: `${parseEffectiveness(matchup[1])}`, inline: true });
		}

		embed.fields.push({ name: `nicht sehr effektiv`, value: `\u200B`});
		for (const matchup of noteffective) {
			embed.fields.push({ name: language.lookup(`pokemon.types.${matchup[0]}`,'de'), value: `${parseEffectiveness(matchup[1])}`, inline: true });
		}

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
			return language.lookup('pokemon.effectiveness.veryeffect', 'de');
		default:
			return language.lookup('pokemon.effectiveness.unknown', 'de');
	}
}