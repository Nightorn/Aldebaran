import Command from "../../groups/FunCommand.js";
import Client from "../../structures/Client.js";
import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";

export default class EmojilistCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Displays all emojis for a the server",
			requiresGuild: true,
            platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	run(ctx: DiscordMessageContext) {
		const emojilist = ctx.server!.guild.emojis.cache
			.map(e => e.toString()).join("");
		if (emojilist.length <= 2000)
			ctx.reply(emojilist);
		else ctx.error("IMPOSSIBLE", "There are too many emojis on this server to show in a single message.");
	}
}
