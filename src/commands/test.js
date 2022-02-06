const { SlashCommandBuilder } = require('@discordjs/builders');
const PokemonService = require('../services/pokemon-service');
const { capitalize, TypeColors, Language } = require('../utils/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(Language.lookup('command.test.name'))
		.setDescription(Language.lookup('command.test.description')),

	async execute(interaction) {
		await interaction.deferReply({ fetchReply: true });
    
    let pokemon = await PokemonService.getRandomPokemon();
    pokemon = pokemon.results[0];
    let type = await PokemonService.getRandomType();
    type = type.results[0];

    const effectiveness = this.getEffectiveness(pokemon, type).toLowerCase();

    const question = `You're attacking ${pokemon.name} with a(n) ${type.name}. Which effectiveness will the attack have?`;
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

  getEffectiveness(pokemon, type) {
    switch (true) {
      case pokemon.type_defenses.double_damage_from.includes(type.name):
        return Language.lookup('pokemon.effectiveness.veryeffective');
      case pokemon.type_defenses.half_damage_from.includes(type.name):
        return Language.lookup('pokemon.effectiveness.notveryeffective');
      case pokemon.type_defenses.no_damage_from.includes(type.name):
        return Language.lookup('pokemon.effectiveness.noeffect');
      default:
        return Language.lookup('pokemon.effectiveness.effective');
    }
  }
};