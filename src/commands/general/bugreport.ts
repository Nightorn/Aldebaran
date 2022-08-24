// Command Developed with the help of Akashic Bearer#2305
import { EmbedBuilder, WebhookClient } from "discord.js";
import Command from "../../groups/Command.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const id = process.env.WEBHOOK_SUGGESTIONS_ID || "";
const token = process.env.WEBHOOK_SUGGESTIONS_TOKEN || "";

export default class BugreportCommand extends Command {
	constructor() {
		super({
			description: "Sends a bug report",
			example: "ur bot doesnt work",
			args: { report: {
				as: "string",
				desc: "Details about the bug you have encountered"
			} }
		});
	}

	run(ctx: MessageContext) {
		const { report } = ctx.args as { report: string };

		if (!report) return ctx.reply("Your report cannot be empty.");
		
		const embed = new EmbedBuilder()
			.setDescription(report)
			.setFooter({ text: `User: ${ctx.author.tag} [ID: ${ctx.author.id}]` });

		new WebhookClient({ id, token }).send({
			username: ctx.author.username,
			avatarURL: ctx.author.avatarURL,
			embeds: [embed]
		}).then(() => {
			ctx.reply("Your bug report has been sent to the main server!");
		});

		return true;
	}
}
