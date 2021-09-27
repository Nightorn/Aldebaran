// Command Developed with the help of Akashic Bearer#2305
import { MessageEmbed, WebhookClient } from "discord.js";
import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class SuggestCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Sends a suggestion",
			usage: "Suggestion",
			example: "more nsfw commands"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args.length === 0) return ctx.reply("You can't send an empty suggestion.");
		const embed = new MessageEmbed()
			.setDescription(args.join(" "))
			.setFooter(`User: ${ctx.message.author.tag} [ID: ${ctx.message.author.id}]`);
		new WebhookClient({
			id: "685901108262076565",
			token: "Qy3jDeK9uUO3bIqpYgkZ6MrkspZ9m5H8T6r2IjxWITAiEtNlpFUuaJz-snayg8bXUJWy"
		}).send({
			username: ctx.message.author.username,
			avatarURL: ctx.message.author.displayAvatarURL(),
			embeds: [embed]
		}).then(() => {
			ctx.reply("Your suggestion has been sent to the main server!");
		});
		return true;
	}
};
