const Sentry = require("@sentry/node");

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

    const commandScope = Sentry.getCurrentHub().pushScope();
		commandScope.setTag("command", interaction.commandName);
		commandScope.setContext("options", interaction.options.data);
		commandScope.setUser(interaction.user);

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
			interaction.client.logger.error(error);
			Sentry.captureException(error);

			await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
		}

		Sentry.getCurrentHub().popScope();
	},
};