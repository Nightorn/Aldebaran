import Client from "nekos.life";
import { Command } from "../../groups/FunCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class KaomojiCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Displays a random kaomoji" });
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot: AldebaranClient, message: Message) {
		const neko = new Client();
		message.delete().catch(() => {});
		const data = await neko.sfw.catText();
		message.channel.send(data.cat);
	}
};
