import { Command, Embed } from "../../groups/FunCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class OwoifyCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Sends an owoified text",
			usage: "Text",
			example: "why is the grass green?"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(_: AldebaranClient, message: Message, args: any) {
		let text = args.join(" ");
		text = text.replace(/r|l/g, "w");
		const embed = new Embed(this)
			.setTitle("owoifier")
			.setDescription(text);
		message.channel.send({ embed });
	}
};
