import Command from "../../groups/ImageCommand.js";
import Client from "../../structures/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { createNekosEmbed } from "../../utils/Methods.js";

export default class NekoCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Displays a random neko picture or a GIF"
		});
	}

	async run(ctx: MessageContext) {
		return ctx.reply(await createNekosEmbed(
			`<@${ctx.author.id}>, here is your innocent neko.`,
			ctx.client.nekoslife.neko
		));
	}
}
