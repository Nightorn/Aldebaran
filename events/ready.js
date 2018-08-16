
exports.run = (client) => {
	if (process.argv.indexOf('dev') !== -1) {
		console.log(`Bot has started in dev mode with prefix ${process.argv[3]}, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
		client.user.setActivity(`Aldebaran Developer mode`);
	} else {
		console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
		client.user.setActivity(`Serving ${client.guilds.size} servers`);
	}
}