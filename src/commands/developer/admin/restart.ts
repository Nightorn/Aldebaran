import { MessageEmbed } from "discord.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";
import { Command } from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";

export default class RestartSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Restarts Aldebaran",
			perms: { aldebaran: ["RESTART_BOT"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const embed = new MessageEmbed()
			.setTitle(`Restarting ${ctx.client.user!.username}`)
			.setDescription("Restarting the bot, depending on the bot size, this should take a while.")
			.setColor("ORANGE");
		ctx.reply(embed).then(() => {
			ctx.client.destroy();
			ctx.client = new AldebaranClient();
		});
	}
};
