import { MessageEmbed } from "discord.js";
import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Client from "../../structures/Client.js";

export default class FactCommand extends Command {
	constructor(client: Client) {
		super(client, { description: "Get a random fact!" });
	}

	async run(ctx: MessageContext) {
		const data = await ctx.client.nekoslife.fact();
		const embed = new MessageEmbed()
			.setTitle("The fact is...")
			.setColor(this.color)
			.setDescription(`*${data.fact}*`)
			.setFooter({
				text: "Powered by nekos.life",
				iconURL: ctx.client.discord.user!.avatarURL()!
			});
		ctx.reply(embed);
	}
}
