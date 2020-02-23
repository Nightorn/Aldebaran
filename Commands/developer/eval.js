const util = require("util");
const { MessageAttachment } = require("discord.js");
const { Command } = require("../../structures/categories/DeveloperCategory");

module.exports = class EvalCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Evaluates JavaScript code"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		try {
			const code = args.join(" ");
			// eslint-disable-next-line no-eval
			let evaled = eval(code);

			if (typeof evaled !== "string" && typeof evaled !== "number") {
				evaled = util.inspect(evaled, false, null);
			}

			message.channel.send(evaled, { code: "xl" }).catch(() => {
				message.channel.send("The result was too long to be sent on Discord. Everything is in the attachment.", {
					files: [new MessageAttachment(Buffer.from(evaled), "evaled.txt")]
				});
			});
		} catch (err) {
			message.channel.send(`An error occured.\n\`\`\`xl\n${util.inspect(err, false, null)}\n\`\`\``);
		}
	}
};
