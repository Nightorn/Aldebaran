const { Command } = require("../../groups/Command");

module.exports = class PurgeCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Purges messages in channel",
			perms: { discord: ["MANAGE_MESSAGES"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const messageCount = (args[0] > 1) ? Math.floor(parseInt(args[0], 10)) : 1;
		message.channel.bulkDelete(messageCount).then(() => {
			message.channel.send(`:ok_hand: Purged ${messageCount} messages`).then(msg => {
				msg.delete({ timeout: 10000, reason: `${message.author.tag} | Purged ${messageCount} messages` });
			});
		}).catch(() => {
			message.reply("an error occured and the command could not run properly.");
		});
		return true;
	}
};
