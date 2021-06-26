import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/DeveloperCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class RestartCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Restarts Aldebaran",
			perms: { aldebaran: ["RESTART_BOT"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message) {
		const embed = new MessageEmbed()
			.setTitle(`Restarting ${bot.user!.username}`)
			.setDescription("Restarting the bot, depending on the bot size, this should take a while.")
			.setColor("ORANGE");
		message.channel.send({ embed }).then(() => {
			bot.destroy();
			bot = new AldebaranClient();
		});
	}
};
