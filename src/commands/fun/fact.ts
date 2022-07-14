import { MessageEmbed } from "discord.js";
import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class FactCommand extends Command {
	constructor() {
		super({ description: "Get a random fact!" });
	}

	async run(ctx: MessageContext) {
		const data = await ctx.client.nekoslife.fact();
		const embed = new MessageEmbed()
			.setTitle("The fact is...")
			.setColor(this.color)
			.setDescription(`*${data.fact}*`)
			.setFooter({
				text: "Powered by nekos.life",
				iconURL: "https://avatars.githubusercontent.com/u/34457007"
			});
		ctx.reply(embed);
	}
}
