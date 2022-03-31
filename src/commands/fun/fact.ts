import { MessageEmbed } from "discord.js";
import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class FactCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Get a random fact!" });
	}

	async run(ctx: MessageContext) {
		const data = await ctx.client.nekoslife.sfw.fact();
		const embed = new MessageEmbed()
			.setTitle("The fact is...")
			.setColor(this.color)
			.setDescription(`*${data.fact}*`)
			.setFooter({
				text: "Powered by nekos.life",
				iconURL: ctx.client.user.avatarURL()!
			});
		ctx.reply(embed);
	}
}
