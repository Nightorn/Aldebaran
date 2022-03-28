import { Command as C, Embed as E } from "../../groups/NSFWCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const { Command, Embed } = subCategory(C, E);

export default class XLesbianCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a lesbian hentai picture or GIF"
		});
	}

	async run(ctx: MessageContext) {
		const embed = new Embed(this,
			`${ctx.author}  LEZ be Honest!`);
		embed.send(ctx, ctx.client.nekoslife.nsfw.lesbian);
	}
};
