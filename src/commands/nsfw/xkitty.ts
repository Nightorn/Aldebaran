import { Command as C, Embed as E } from "../../groups/NSFWCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

const { Command, Embed } = subCategory(C, E);

export default class XKittyCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a hentai picture or a GIF with a kitty"
		});
	}

	async run(ctx: MessageContext) {
		const embed = new Embed(this,
			`${ctx.message.author}, here is your kitty!`);
		embed.send(ctx, ctx.client.nekoslife.nsfw.pussy);
	}
};
