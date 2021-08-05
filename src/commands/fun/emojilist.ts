import { Command } from "../../groups/FunCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class EmojilistCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays all emojis for a the server"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(_: AldebaranClient, message: Message) {
		const emojilist = message.guild.emojis.cache.map(e => e.toString()).join("");
		message.delete();
		if (emojilist.length <= 2000)
			message.channel.send(emojilist);
		else message.channel.error("IMPOSSIBLE", "There are too many emojis on this server to show in a single message.");
	}
};
