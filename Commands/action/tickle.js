const Client = require("nekos.life");
const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/ActionCategory");

module.exports = class TickleCommand extends Command {
	constructor(client) {
		super(client, {
			name: "tickle",
			description: "Tickle someone!",
			usage: "UserMention",
			example: "<@437802197539880970>"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message) {
		const neko = new Client();
		if (message.mentions.users.first()) { // Check if the message has a mention in it.
			const target = message.mentions.users.first();
			const data = await neko.getSFWTickle();
			const embed = new MessageEmbed()
				.setDescription(`${message.author} won't stop tickling ${target}!`)
				.setImage(data.url)
				.setFooter("Powered by nekos.life", bot.user.avatarURL())
				.setColor(this.color);
			message.channel.send({ embed });
		} else {
			message.reply("Please mention someone :thinking:");
		}
	}
};
