import { Command as C, Embed as E } from "../../groups/NSFWCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const { Command, Embed } = subCategory(C, E);

export default class XRandomCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a random hentai picture or GIF"
		});
	}

	async run(ctx: MessageContext) {
		const embed = new Embed(this,
			`${ctx.author}, you wanted something random? Here you go!`);
		embed.send(ctx, ctx.client.nekoslife.nsfw.randomHentaiGif);
	}
};
