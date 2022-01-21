const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PokemonService = require('../services/pokemon-service');
const { capitalize, parseEffectiveness, Language } = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.battle.name', 'en'))
		.setDescription(Language.lookup('command.battle.description', 'en'))
		.addStringOption(option =>
			option.setName(Language.lookup('option.pokemon.name', 'en'))
				.setDescription(Language.lookup('option.pokemon.description', 'en'))
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();

		const parameter = interaction.options.getString(Language.lookup('option.pokemon.name', 'en'), true);
		const searchTerm = parameter.toLowerCase();
    
		const pokemon = await PokemonService.getPokemon(searchTerm);

		const matchups = Object.values(pokemon.type_defenses);
		const effectiveMatchups = matchups.filter(matchup => matchup.effectivness > 1);
		const notEffectiveMatchups = matchups.filter(matchup => matchup.effectivness < 1);

		const embed = new MessageEmbed({
			title: capitalize(pokemon.name),
			fields: [],
		});

		const effectiveFieldValue = effectiveMatchups.map(this.formatMatchup).join('\r\n');
		embed.fields.push({ name: Language.lookup('pokemon.effectiveness.veryeffective', 'en'), value: effectiveFieldValue });

		const notEffectiveFieldValue = notEffectiveMatchups.map(this.formatMatchup).join('\r\n');
		embed.fields.push({ name: Language.lookup('pokemon.effectiveness.notveryeffective', 'en'), value: notEffectiveFieldValue });

		await interaction.editReply({ embeds: [embed] });
	},

	formatMatchup: function (matchup) {
		const type = capitalize(Language.lookup(`pokemon.types.${matchup.attacker}`, 'en'));
		const effectiveness = parseEffectiveness(matchup.effectivness);

		return `${type}: ${effectiveness}`;
	},
};