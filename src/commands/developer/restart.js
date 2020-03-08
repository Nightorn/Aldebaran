const { MessageEmbed } = require("discord.js");
const { Command } = require("../../groups/DeveloperCommand");
const AldebaranClient = require("../../structures/djs/Client");

module.exports = class RestartCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Restarts Aldebaran",
			perms: { aldebaran: ["RESTART_BOT"] }
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
