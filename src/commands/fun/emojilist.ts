import { Command } from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class EmojilistCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays all emojis for a the server",
			requiresGuild: true
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const emojilist = ctx.guild!.guild.emojis.cache
			.map(e => e.toString()).join("");
		if (emojilist.length <= 2000)
			ctx.reply(emojilist);
		else ctx.error("IMPOSSIBLE", "There are too many emojis on this server to show in a single message.");
	}
};
