import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class OwoifyCommand extends Command {
	constructor() {
		super({
			description: "Sends an owoified text",
			example: "why is the grass green?",
			args: { text: { as: "string", desc: "The text to owoify" } }
		});
	}

	run(ctx: MessageContext) {
		const { text } = ctx.args as { text: string };
		const embed = this.createEmbed()
			.setTitle("owoifier")
			.setDescription(text.replace(/r|l/g, "w"));
		ctx.reply(embed);
	}
}
