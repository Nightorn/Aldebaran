import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class PurgeCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Purges messages in channel",
			perms: { discord: ["MANAGE_MESSAGES"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(_: AldebaranClient, message: Message, args: any) {
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
