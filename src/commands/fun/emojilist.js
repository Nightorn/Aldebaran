const { Command } = require("../../groups/FunCommand");

module.exports = class EmojilistCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays all emojis for a the server"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message) {
		const emojilist = message.guild.emojis.cache.map(e => e.toString()).join("");
		message.delete();
		if (emojilist.length <= 2000)
			message.channel.send(emojilist);
		else message.channel.error("IMPOSSIBLE", "There are too many emojis on this server to show in a single message.");
	}
};
