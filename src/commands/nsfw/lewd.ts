import { Command, Embed } from "../../groups/NSFWCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
import { imageUrls } from "../../utils/Constants.js";

export default class LewdCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Performs a lewd action on the specified user",
			usage: "User",
			example: "<@437802197539880970>",
			args: { user: { as: "user" } }
		});
	}

	run(bot: AldebaranClient, message: Message, args: any) {
		const sendlewds = imageUrls
			.lewds[Math.floor(Math.random() * imageUrls.lewds.length)];
		bot.users.fetch(args.user).then(target => {
			const embed = new Embed(this)
				.setDescription(`${message.author} is being lewd towards ${target}`)
				.setImage(sendlewds);
			message.channel.send({ embed });
		}).catch(() => {
			message.reply("Please mention someone :thinking:");
		});
	}
};
