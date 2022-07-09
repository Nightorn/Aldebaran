import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Client from "../../structures/Client.js";

export default class KaomojiCommand extends Command {
	constructor(client: Client) {
		super(client, { description: "Displays a random kaomoji" });
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		ctx.reply((await ctx.client.nekoslife.catText()).cat);
	}
}
