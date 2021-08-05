import { Command, Embed } from "../../groups/FunCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class SayCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Make the bot say something",
			usage: "Text",
			example: "i am gay"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message, args: any) {
		message.delete().catch(() => {});
		const embed = new Embed(this)
			.setAuthor(message.author.username, message.author.pfp())
			.setDescription(args.join(" "));
		message.channel.send({ embed });
	}
};
