// Command Developed with the help of Akashic Bearer#2305
import { MessageEmbed, WebhookClient } from "discord.js";
import Command from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class SuggestCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Sends a suggestion",
			example: "more nsfw commands",
			args: { suggestion: {
				as: "string",
				desc: "Details about the suggestion you want to make"
			} }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const { suggestion } = ctx.args as { suggestion: string };
		const embed = new MessageEmbed()
			.setDescription(suggestion)
			.setFooter({ text: `User: ${ctx.author.user.tag} [ID: ${ctx.author.id}]` });
		new WebhookClient({
			id: process.env.WEBHOOK_SUGGESTIONS_ID!,
			token: process.env.WEBHOOK_SUGGESTIONS_TOKEN!
		}).send({
			username: ctx.author.username,
			avatarURL: ctx.author.avatarURL,
			embeds: [embed]
		}).then(() => {
			ctx.reply("Your suggestion has been sent to the main server!");
		});
		return true;
	}
};
