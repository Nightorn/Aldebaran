import { Command as C, Embed as E } from "../../groups/NSFWCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

const { Command, Embed } = subCategory(C, E);

export default class XNekoCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a hentai neko picture or GIF"
		});
	}

	async run(ctx: MessageContext) {
		const embed = new Embed(this,
			`${ctx.message.author}, here is your naughty neko.`);
		embed.send(ctx, ctx.client.nekoslife.nsfw.nekoGif);
	}
};
