import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class SayCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Make the bot say something",
			example: "aldebaran is the best bot",
			args: { text: { as: "string", desc: "What you want Aldebaran to say" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const { text } = ctx.args as { text: string };
		const embed = this.createEmbed(ctx)
			.setDescription(text);
		ctx.reply(embed);
	}
}
