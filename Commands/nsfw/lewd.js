const lewds = require("../../Data/imageurls.json");
const { Command, Embed } = require("../../structures/categories/NSFWCategory");

module.exports = class LewdCommand extends Command {
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
