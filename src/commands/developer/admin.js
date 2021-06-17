import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/DeveloperCommand.js";

export default class AdminCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Admin Portal Command",
			allowIndexCommand: true,
			perms: { aldebaran: ["EDIT_USERS"] }
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
