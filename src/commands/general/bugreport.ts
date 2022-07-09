// Command Developed with the help of Akashic Bearer#2305
import { MessageEmbed, WebhookClient } from "discord.js";
import Command from "../../groups/Command.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Client from "../../structures/Client.js";

export default class BugreportCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Sends a bug report",
			example: "ur bot doesnt work",
			args: { report: {
				as: "string",
				desc: "Details about the bug you have encountered"
			} }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const { report } = ctx.args as { report: string };
		const embed = new MessageEmbed()
			.setDescription(report)
			.setFooter({ text: `User: ${ctx.author.tag} [ID: ${ctx.author.id}]` });
		new WebhookClient({
			id: process.env.WEBHOOK_BUGREPORTS_ID!,
			token: process.env.WEBHOOK_BUGREPORTS_TOKEN!
		}).send({
			username: ctx.author.username,
			avatarURL: ctx.author.avatarURL,
			embeds: [embed]
		}).then(() => {
			ctx.reply("Your bug report has been sent to the main server!");
		});
		return true;
	}
}
