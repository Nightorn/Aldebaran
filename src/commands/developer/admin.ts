import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/DeveloperCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

import clear from "./admin/clear.js";
import mod from "./admin/mod.js";
import setperm from "./admin/setperm.js";
import timeout from "./admin/timeout.js";
import view from "./admin/view.js";

export default class AdminCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Admin Portal Command",
			allowIndexCommand: true,
			perms: { aldebaran: ["EDIT_USERS"] }
		});
		this.registerSubcommands(clear, mod, setperm, timeout, view);
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
