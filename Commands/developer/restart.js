const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/DeveloperCategory");
const AldebaranClient = require("../..//structures/Discord/Client.js");

module.exports = class RestartCommand extends Command {
	constructor(client) {
		super(client, {
			name: "restart",
			description: "Restarts Aldebaran",
			perms: {
				aldebaran: ["SUPPORT"]
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message) {
		const embed = new MessageEmbed()
			.setTitle(`Restarting ${bot.user.username}`)
			.setDescription("Restarting the bot, depending on the bot size, this should take a while.")
			.setColor("ORANGE");
		message.channel.send({ embed }).then(() => {
			bot.destroy();
			bot = new AldebaranClient();
		});
	}
};
