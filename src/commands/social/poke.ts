import { Command as C, Embed as E } from "../../groups/SocialCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

const { Command, Embed } = subCategory(C, E);

export default class PokeCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Poke someone!",
			example: "<@437802197539880970>",
			args: { target: { as: "user", desc: "The person to poke" } }
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { target: string };
		ctx.client.users.fetch(args.target).then(target => {
			const embed = new Embed(this, `${ctx.message.author} is poking ${target}`);
			embed.send(ctx, ctx.client.nekoslife.sfw.poke);
		}).catch(() => { ctx.reply("Please mention someone :thinking:"); });
	}
};
