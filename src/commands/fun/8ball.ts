import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class EightballCommand extends Command {
	constructor() {
		super({
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
					iconURL: "https://avatars.githubusercontent.com/u/34457007"
				});
			ctx.reply(embed);
		}
	}
}
