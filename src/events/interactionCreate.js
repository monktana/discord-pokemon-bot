module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			interaction.client.logger.info({
				message: `command executed.`,
				user: interaction.user.username,
				command: interaction.commandName,
				options: interaction.options.data
			})
			await command.execute(interaction);
		}
		catch (error) {
			interaction.logger.error(error);

			await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};