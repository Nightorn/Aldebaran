import Command from "../../groups/ImageCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { createNekosEmbed } from "../../utils/Methods.js";

export default class LizardCommand extends Command {
	constructor() {
		super({
			description: "Displays a random lizard picture or a GIF"
		});
	}

	async run(ctx: MessageContext) {
		return ctx.reply(await createNekosEmbed(
			"We're off to see the lizard, the wonderful lizard of Oz!",
			ctx.client.nekoslife.lizard
		));
	}
}
