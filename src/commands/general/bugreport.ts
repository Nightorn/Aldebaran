// Command Developed with the help of Akashic Bearer#2305
import { MessageEmbed, WebhookClient } from "discord.js";
import { Command } from "../../groups/Command.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class BugreportCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Sends a bug report",
			usage: "BugReport",
			example: "ur bot doesnt work"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args.length === 0) return ctx.reply("You can't send an empty bug report.");
		const embed = new MessageEmbed()
			.setDescription(args.join(" "))
			.setFooter(`User: ${ctx.message.author.tag} [ID: ${ctx.message.author.id}]`);
		new WebhookClient({
			id: "685907959477436481",
			token: "PX_gaoqJxIPVfrFBZVBZ855XvqqIqksNBFEPEXxIemyRWF0XlxYYhUkISkoxv405gB01"
		}).send({
			username: ctx.message.author.username,
			avatarURL: ctx.message.author.displayAvatarURL(),
			embeds: [embed]
		}).then(() => {
			ctx.reply("Your bug report has been sent to the main server!");
		});
		return true;
	}
};
