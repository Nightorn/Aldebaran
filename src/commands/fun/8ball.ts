import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Client from "../../structures/Client.js";

export default class EightballCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Ask the magic 8ball a question, you will be given the right answer",
			example: "Should Allen get a hug?",
			name: "8ball",
			args: { question: {
				as: "string",
				desc: "The question you want the 8ball to answer"
			} }
		});
	}

	async run(ctx: MessageContext) {
		const { question } = ctx.args as { question: string };
		const data = await ctx.client.nekoslife.eightBall({ text: question });
		if (data.url) {
			const embed = this.createEmbed(ctx)
				.setDescription(`**${data.response}**`)
				.setImage(data.url)
				.setFooter({
					text: "Powered by nekos.life",
					iconURL: ctx.client.discord.user.displayAvatarURL()
				});
			ctx.reply(embed);
		}
	}
}
