import fs from "fs";
import { Command, Embed } from "../../groups/NSFWCommand.js";

const lewds = JSON.parse(fs.readFileSync("../../assets/data/imageurls.json"));

export default class LewdCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Performs a lewd action on the specified user",
			usage: "User",
			example: "<@437802197539880970>",
			args: { user: { as: "user" } }
		});
	}

	run(bot, message, args) {
		const sendlewds = lewds
			.lewds[Math.floor(Math.random() * lewds.lewds.length)];
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
