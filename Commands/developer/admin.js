const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/DeveloperCategory");

module.exports = class AdminCommand extends Command {
	constructor(client) {
		super(client, {
			name: "admin",
			description: "Admin Portal Command",
			allowIndexCommand: true
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message) {
		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.avatarURL())
			.setTitle("Warning")
			.setDescription("The admin action specified is invalid.")
			.setColor("ORANGE");
		message.channel.send({ embed });
	}
};
