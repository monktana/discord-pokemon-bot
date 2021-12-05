const { SlashCommandBuilder } = require('@discordjs/builders');
const language = require('../utils/language.js');
const typematchups = require('../utils/typematchups.js');

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
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();

		let attackingType = interaction.options.getString(language.lookup('option.type.attacking', 'de'));
		let defendingType = interaction.options.getString(language.lookup('option.type.defending', 'de'));

		attackingType = language.translate(attackingType, 'de', 'en');
		defendingType = language.translate(defendingType, 'de', 'en');

		const effectiveness = typematchups[attackingType][defendingType];
		let reply = '';
		switch (effectiveness) {
			case 0:
				reply = language.lookup('pokemon.effectiveness.noeffect', 'de');
				break;
			case 0.50:
				reply = language.lookup('pokemon.effectiveness.notveryeffective', 'de');
				break;
			case 1:
				reply = language.lookup('pokemon.effectiveness.effective', 'de');
				break;
			case 2:
				reply = language.lookup('pokemon.effectiveness.notveryeffective', 'de');
				break;
			default:
				reply = language.lookup('pokemon.effectiveness.unknown', 'de');
				break;
		}

		await interaction.editReply(reply);
	},
};