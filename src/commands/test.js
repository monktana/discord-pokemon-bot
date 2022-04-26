const util = require('util');
const { SlashCommandBuilder } = require('@discordjs/builders');
const PokemonService = require('../services/pokemon-service');
const { calculateEffectiveness, parseEffectiveness, Language } = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.test.name', 'en'))
		.setDescription(Language.lookup('command.test.description', 'en')),

	async execute(interaction) {
		await interaction.deferReply({ fetchReply: true });

		const pokemon = await PokemonService.getRandomPokemon();
		const attackingType = await PokemonService.getRandomType();

		const effectiveness = calculateEffectiveness(attackingType, pokemon.types);
		const answer = parseEffectiveness(effectiveness).toLowerCase();

		const filter = (response) => {
			return response.content.toLowerCase().includes(answer);
		};

		const question = util.format(Language.lookup('command.test.question', 'en'), pokemon.name, attackingType.name);
		await interaction.editReply(question);

		try {
			const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
			await interaction.followUp(util.format(Language.lookup('command.test.correct', 'en'), collected.first().author));
		}
		catch (error) {
			await interaction.followUp(Language.lookup('command.test.noanswer', 'en'));
		}
	},
};