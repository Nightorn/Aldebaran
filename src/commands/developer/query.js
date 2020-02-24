const { MessageAttachment } = require("discord.js");
const util = require("util");
const { Command } = require("../../groups/DeveloperCommand");

module.exports = class QueryCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Queries the database",
			perms: { aldebaran: ["SUPERADMIN"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		bot.database.query(args.join(" ")).then(result => {
			message.channel.send(util.inspect(result, false, null), { code: "xl" }).catch(() => {
				message.channel.send("The result was too long to be sent on Discord. Everything is in the attachment.", {
					files: [new MessageAttachment(Buffer.from(util.inspect(result, false, null)), "test.txt")]
				});
			});
		}).catch(err => {
			message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
		});
	}
};
