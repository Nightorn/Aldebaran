// Command Developed with the help of Akashic Bearer#2305
const { MessageEmbed, WebhookClient } = require("discord.js");
const { Command } = require("../../groups/DeveloperCommand");

module.exports = class CommandDevtodo extends Command {
	constructor(client) {
		super(client, {
			description: "Sends a suggestion",
			usage: "Suggestion",
			example: "fix bugs",
			perms: { aldebaran: ["DEVELOPER"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args.length === 0) return message.channel.send("You can't send an empty todo.");
		const embed = new MessageEmbed()
			.setDescription(args.join(" "))
			.setFooter(`User: ${message.author.tag} [ID: ${message.author.id}]\nChannel: #${message.channel.name} [ID: ${message.channel.id}]\nServer: ${message.guild.name} [ID: ${message.guild.id}]`);
		new WebhookClient("685908622756413519", "UJmgM3YOT1M24fowmj9fyn2LjT1iwTjDUjK52exeKkmt0a5ow7kJaIRQ3KOwF9brsoiN").send({
			username: message.author.username,
			avatarURL: message.author.displayAvatarURL(),
			embeds: [embed]
		}).then(() => {
			message.channel.send("Your todo has been sent!");
		});
		return true;
	}
};
