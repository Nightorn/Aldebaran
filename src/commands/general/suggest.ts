// Command Developed with the help of Akashic Bearer#2305
import { EmbedBuilder, WebhookClient } from "discord.js";
import Command from "../../groups/Command.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const id = process.env.WEBHOOK_SUGGESTIONS_ID || "";
const token = process.env.WEBHOOK_SUGGESTIONS_TOKEN || "";

export default class SuggestCommand extends Command {
	constructor() {
		super({
			description: "Sends a suggestion",
			example: "more nsfw commands",
			args: { suggestion: {
				as: "string",
				desc: "Details about the suggestion you want to make"
			} }
		});
	}

	run(ctx: MessageContext) {
		const { suggestion } = ctx.args as { suggestion: string };

		if (!suggestion) return ctx.reply("Your suggestion cannot be empty.");

		const embed = new EmbedBuilder()
			.setDescription(suggestion)
			.setFooter({ text: `User: ${ctx.author.tag} [ID: ${ctx.author.id}]` });

		new WebhookClient({ id, token }).send({
			username: ctx.author.username,
			avatarURL: ctx.author.avatarURL,
			embeds: [embed]
		}).then(() => {
			ctx.reply("Your suggestion has been sent to the main server!");
		});

		return true;
	}
}
