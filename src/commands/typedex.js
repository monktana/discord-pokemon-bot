const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service');
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

		const type = await PokemonService.getType(searchTerm);

		const embed = new MessageEmbed({
			color: TypeColors[type.name],
			title: capitalize(type.name),
			fields: [],
		});

		const veryEffectiveTypes = type.matchups.double_damage_to.map(this.formatMatchup).join(', ');
		if (veryEffectiveTypes) {
			embed.fields.push({ 
				name: '✅ ' + Language.lookup('pokemon.effectiveness.veryeffective'), 
				value: veryEffectiveTypes
			});
		}

		const notEffectiveTypes = type.matchups.half_damage_to.map(this.formatMatchup).join(', ');
		embed.fields.push({ 
			name: '❌ ' + Language.lookup('pokemon.effectiveness.notveryeffective'), 
			value: notEffectiveTypes
		});
		
		const noEffectTypes = type.matchups.no_damage_to.map(this.formatMatchup).join(', ');
		if (noEffectTypes) {
			embed.fields.push({ 
				name: '🚫 ' + Language.lookup('pokemon.effectiveness.noeffect'), 
				value: noEffectTypes
			});
		}

		await interaction.editReply({ embeds: [embed] });
	},

	formatMatchup(matchup) {
		return capitalize(Language.lookup(`pokemon.types.${matchup.name}`));
	},
};