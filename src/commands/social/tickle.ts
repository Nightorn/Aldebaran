import { Command as C, Embed as E } from "../../groups/SocialCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

const { Command, Embed } = subCategory(C, E);

export default class TickleCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Tickle someone!",
			example: "<@437802197539880970>"
		});
	}

	async run(ctx: MessageContext) {
		if (ctx.message.mentions.users.first()) {
			const target = ctx.message.mentions.users.first();
			const embed = new Embed(this,
				`${ctx.message.author} won't stop tickling ${target}!`);
			embed.send(ctx, ctx.client.nekoslife.sfw.tickle);
		} else {
			ctx.reply("Please mention someone :thinking:");
		}
	}
};
