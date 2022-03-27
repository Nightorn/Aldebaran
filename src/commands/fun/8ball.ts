import { Command, Embed } from "../../groups/FunCommand.js";
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
		const data = await ctx.client.nekoslife.sfw["eightBall"]({ text: question });
		const embed = new Embed(this)
			.setDescription(`**${data.response}**`)
			.setImage(data.url!)
			.setFooter("Powered by nekos.life", ctx.client.user.avatarURL()!);
		ctx.reply(embed);
	}
};
