import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class OwoifyCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Sends an owoified text",
			example: "why is the grass green?",
			args: { text: { as: "string", desc: "The text to owoify" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const { text } = ctx.args as { text: string };
		const embed = this.createEmbed(ctx)
			.setTitle("owoifier")
			.setDescription(text.replace(/r|l/g, "w"));
		ctx.reply(embed);
	}
}
