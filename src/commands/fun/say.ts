import { Command, Embed } from "../../groups/FunCommand.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class SayCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Make the bot say something",
			usage: "Text",
			example: "aldebaran is the best bot"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const embed = new Embed(this)
			.setAuthor(
				ctx.message.author.username,
				ctx.message.author.displayAvatarURL()
			)
			.setDescription(args.join(" "));
		ctx.reply(embed);
	}
};
