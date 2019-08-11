const { MessageEmbed } = require("discord.js");
const Client = require("nekos.life");
const { Command } = require("../../structures/categories/ActionCategory");

module.exports = class PokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "poke",
			description: "Poke someone!",
			usage: "UserMention",
			example: "<@437802197539880970>"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message) {
		const neko = new Client();
		if (message.mentions.users.first()) {
			const target = message.mentions.users.first();
			const data = await neko.getSFWPoke();
			const embed = new MessageEmbed()
				.setDescription(`${message.author} is poking ${target}`)
				.setImage(data.url)
				.setFooter("Powered by nekos.life", bot.user.avatarURL())
				.setColor(this.color);
			message.channel.send({ embed });
		} else {
			message.reply("Please mention someone :thinking:");
		}
	}
};
