import { Command, Embed } from "../../groups/FunCommand.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class EightballCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Ask the magic 8ball a question, you will be given the right answer",
			example: "Should Allen get a hug?",
			name: "8ball",
			usage: "Question"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const text = (ctx.args as string[]).join(" ");
		if (text) {
			const data = await ctx.client.nekoslife.sfw["8Ball"]({ text });
			const embed = new Embed(this)
				.setDescription(`**${data.response}**`)
				.setImage(data.url!)
				.setFooter("Powered by nekos.life", ctx.client.user.avatarURL()!);
			ctx.reply(embed);
		} else {
			ctx.reply("Please ask a question");
		}
	}
};
