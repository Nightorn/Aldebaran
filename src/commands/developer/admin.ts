import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/DeveloperCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class AdminCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Admin Portal Command",
			allowIndexCommand: true,
			perms: { aldebaran: ["EDIT_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(_: AldebaranClient, message: Message) {
		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.pfp())
			.setTitle("Warning")
			.setDescription("The admin action specified is invalid.")
			.setColor("ORANGE");
		message.channel.send({ embed });
	}
};
