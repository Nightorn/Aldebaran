const lewds = require("../../Data/imageurls.json");
const { Command, Embed } = require("../../structures/categories/NSFWCategory");

module.exports = class LewdCommand extends Command {
	constructor(client) {
		super(client, {
			name: "lewd",
			description: "Performs a lewd action on the specified user",
			usage: "UserMention",
			example: "<@437802197539880970>"
		});
	}

	run(bot, message) {
		const sendlewds = `${
			lewds.lewds[Math.floor(Math.random() * lewds.lewds.length)]
		}`;
		if (message.mentions.users.first()) {
			const target = message.mentions.users.first();
			const embed = new Embed(this)
				.setDescription(`${message.author} is being lewd towards ${target}`)
				.setImage(sendlewds);
			message.channel.send({ embed });
		} else {
			message.reply("Please mention someone :thinking:");
		}
	}
};
