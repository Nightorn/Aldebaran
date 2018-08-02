exports.run = (client) => {
	if (process.argv.indexOf('debug') !== -1) {
		console.log(`Bot has started in debug mode, the only usable prefix is "${require('./../config.json').prefix}", with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	} else {
		console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	}
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
  }