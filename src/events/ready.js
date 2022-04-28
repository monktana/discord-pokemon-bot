module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.logger.info({ message: `Ready! Logged in as ${client.user.tag}` });
	},
};