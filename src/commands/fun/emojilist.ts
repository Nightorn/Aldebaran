import Command from "../../groups/FunCommand.js";
import DiscordContext from "../../structures/contexts/DiscordContext.js";

export default class EmojilistCommand extends Command {
	constructor() {
		super({
			description: "Displays all emojis for a the server",
			requiresGuild: true,
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	run(ctx: DiscordContext<true>) {
		const emojilist = ctx.server.guild.emojis.cache
			.map(e => e.toString()).join("");
		if (emojilist.length <= 2000)
			ctx.reply(emojilist);
		else ctx.error("IMPOSSIBLE", "There are too many emojis on this server to show in a single message.");
	}
}
