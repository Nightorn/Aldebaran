import { Command, Embed } from "../../groups/FunCommand.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class OwoifyCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Sends an owoified text",
			usage: "Text",
			example: "why is the grass green?"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const embed = new Embed(this)
			.setTitle("owoifier")
			.setDescription(args.join(" ").replace(/r|l/g, "w"));
		ctx.reply(embed);
	}
};
