import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Client from "../../structures/Client.js";

export default class SayCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Make the bot say something",
			example: "aldebaran is the best bot",
			args: { text: { as: "string", desc: "What you want Aldebaran to say" } }
		});
	}

	run(ctx: MessageContext) {
		const { text } = ctx.args as { text: string };
		const embed = this.createEmbed(ctx)
			.setDescription(text);
		ctx.reply(embed);
	}
}
