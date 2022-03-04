const { SlashCommandBuilder } = require('@discordjs/builders');
const PokemonService = require('../services/pokemon-service');
const { capitalize, Language } = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.test.name'))
		.setDescription(Language.lookup('command.test.description')),

	async execute(interaction) {
		await interaction.deferReply({ fetchReply: true });
    
    const pokemon = await PokemonService.getRandomPokemon();
    const typesOfPokemon = await Promise.all(pokemon.types.map(type => PokemonService.getType(type.name)));
    const attackingType = await PokemonService.getRandomType();

    const effectiveness = this.getEffectiveness(attackingType, typesOfPokemon).toLowerCase();

    const question = `You're attacking ${capitalize(pokemon.name)} with a(n) ${capitalize(attackingType.name)} move. How effective will it be?`;

    const filter = (response) => {
      return response.content.toLowerCase().includes(effectiveness);
    }

		await interaction.editReply(question)
    try {
      const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
      await interaction.followUp(`${collected.first().author} got the correct answer!`);
    } catch (error) {
      interaction.followUp('Looks like nobody got the answer this time.')
    }
	},

  getEffectiveness(attackingType, defendingTypes) {
    const total = defendingTypes.reduce((previous, current) => {
      const defendingType = current.results[0].name
      const matchup = attackingType.matchups.find((def) => def.name === defendingType)
      return previous * matchup.matchup.effectiveness
    }, 1)

    switch (true) {
      case total >= 2:
        return Language.lookup('pokemon.effectiveness.veryeffective');
      case total > 0 && total < 1:
        return Language.lookup('pokemon.effectiveness.notveryeffective');
      case total === 0:
        return Language.lookup('pokemon.effectiveness.noeffect');
      default:
        return Language.lookup('pokemon.effectiveness.effective');
    }
  }
};