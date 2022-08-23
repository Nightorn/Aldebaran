import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class KaomojiCommand extends Command {
	constructor() {
		super({ description: "Displays a random kaomoji" });
	}

	async run(ctx: MessageContext) {
		ctx.reply((await ctx.client.nekoslife.catText()).cat);
	}
}
