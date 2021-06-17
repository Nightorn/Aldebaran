// Command Developed with the help of Akashic Bearer#2305
import { MessageEmbed, WebhookClient } from "discord.js";
import { Command } from "../../groups/Command.js";

export default class CommandBugreport extends Command {
	constructor(client) {
		super(client, {
			description: "Sends a bug report",
			usage: "BugReport",
			example: "ur bot doesnt work"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args.length === 0) return message.channel.send("You can't send an empty bug report.");
		const embed = new MessageEmbed()
			.setDescription(args.join(" "))
			.setFooter(`User: ${message.author.tag} [ID: ${message.author.id}]\nChannel: #${message.channel.name} [ID: ${message.channel.id}]\nServer: ${message.guild.name} [ID: ${message.guild.id}]`);
		new WebhookClient("685907959477436481", "PX_gaoqJxIPVfrFBZVBZ855XvqqIqksNBFEPEXxIemyRWF0XlxYYhUkISkoxv405gB01").send({
			username: message.author.username,
			avatarURL: message.author.displayAvatarURL(),
			embeds: [embed]
		}).then(() => {
			message.channel.send("Your bug report has been sent to the main server!");
		});
		return true;
	}
};
