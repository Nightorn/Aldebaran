// Command Developed with the help of Akashic Bearer#2305
const { MessageEmbed } = require("discord.js");
const { Command } = require("../../groups/Command");

module.exports = class SuggestCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Sends a suggestion",
			usage: "Suggestion",
			example: "more nsfw commands"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args.length === 0) return message.channel.send("You can't send an empty suggestion.");
		const embed = new MessageEmbed()
			.setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.avatarURL())
			.setTitle("New Suggestion")
			.setDescription(args.join(" "))
			.setFooter(`Channel : #${message.channel.name} [ID: ${message.channel.id}] • Server : ${message.guild.name} [ID: ${message.guild.id}]`);
		bot.guilds.get("461792163525689345").channels.get("461802546642681872").send({ embed }).then(() => {
			message.channel.send("Your suggestion has been sent to the main server!");
		});
		return true;
	}
};
