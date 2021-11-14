import { Command as C, Embed as E } from "../../groups/NSFWCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

const { Command, Embed } = subCategory(C, E);

export default class XBoobsCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a hentai picture or GIF showing boobs"
		});
	}

	async run(ctx: MessageContext) {
		const embed = new Embed(this,
			`${ctx.message.author} You want boobs? I give you... BOOBS!`);
		embed.send(ctx, ctx.client.nekoslife.nsfw.boobs);
	}
};
