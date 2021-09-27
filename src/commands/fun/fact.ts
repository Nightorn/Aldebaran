import { Command, Embed } from "../../groups/FunCommand.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class FactCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Get a random fact!" });
	}

	async run(ctx: MessageContext) {
		ctx.message.delete().catch(() => {});
		const data = await ctx.client.nekoslife.sfw.fact();
		const embed = new Embed(this)
			.setTitle("The fact is...")
			.setDescription(`*${data.fact}*`)
			.setFooter("Powered by nekos.life", ctx.client.user.avatarURL()!);
		ctx.reply(embed);
	}
};
