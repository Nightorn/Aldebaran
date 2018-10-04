const { MessageEmbed } = require('discord.js');
exports.run = (client) => {
	const embed = new MessageEmbed()
		.setTitle(`Started ${client.user.username}`)
		.setDescription(`**Uptime** : ${Math.floor(client.uptime)}ms`)
		.setColor(`BLUE`);
	client.guilds.get('461792163525689345').channels.get('485023018045669396').send({embed});

	client.guilds.get('461792163525689345').channels.get('461802546642681872').messages.fetch(200);
	client.guilds.get('461792163525689345').channels.get('463094132248805376').messages.fetch(200);
	client.guilds.get('461792163525689345').channels.get('494129501077241857').messages.fetch(200);

	if (client.debugMode) {
		console.log(`Bot has started in dev mode with prefix ${client.config.prefix}, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
		client.user.setActivity(`Aldebaran Developer mode`);
	} else {
		console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
		client.user.setActivity(`Serving ${client.guilds.size} servers`);
	}
}