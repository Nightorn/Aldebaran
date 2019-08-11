// Command Developed with the help of Akashic Bearer#2305
const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class CommandDevtodo extends Command {
	constructor(client) {
		super(client, {
			name: "devtodo",
			description: "Sends a suggestion",
			usage: "Suggestion",
			example: "fix bugs"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args.length === 0) return message.channel.send("You can't send an empty todo.");
		const embed = new MessageEmbed()
			.setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.avatarURL())
			.setTitle("Todo Sent")
			.setDescription(args.join(" "))
			.setFooter(`Channel : #${message.channel.name} [ID: ${message.channel.id}] • Server : ${message.guild.name} [ID: ${message.guild.id}]`)
			.setColor("BLUE");
		bot.guilds.get("461792163525689345").channels.get("494129501077241857").send({ embed }).then(() => {
			message.channel.send("Your todo has been sent!");
		});
		return true;
	}
};
