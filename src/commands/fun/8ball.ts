import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class EightballCommand extends Command {
	constructor(client: AldebaranClient) {
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

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const { question } = ctx.args as { question: string };
		const data = await ctx.client.nekoslife.sfw.eightBall({ text: question });
		const embed = this.createEmbed(ctx)
			.setDescription(`**${data.response}**`)
			.setImage(data.url!)
			.setFooter({
				text: "Powered by nekos.life",
				iconURL: ctx.client.user.avatarURL()!
			});
		ctx.reply(embed);
	}
}
