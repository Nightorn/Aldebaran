import { Command as C, Embed as E } from "../../groups/ImageCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const { Command, Embed } = subCategory(C, E);

export default class LizardCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a random lizard picture or a GIF"
		});
	}

	async run(ctx: MessageContext) {
		const embed = new Embed(this,
			"We're off to see the lizard, the wonderful lizard of Oz!");
		embed.send(ctx, ctx.client.nekoslife.sfw.lizard);
	}
};
