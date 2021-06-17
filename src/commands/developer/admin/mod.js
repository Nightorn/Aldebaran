import { MessageEmbed } from "discord.js";
import { Command } from "../../../groups/DeveloperCommand.js";

export default class ModSubcommand extends Command {
	constructor(client) {
		super(client, {
			description: "Changes the settings of the specified user or guild",
			subcommand: true,
			perms: { aldebaran: ["EDIT_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args[1] !== undefined) {
			if (args[2] !== undefined) {
				if (args[3] !== undefined) {
					bot.users.fetch(args[1]).then(async user => {
						await user.changeSetting(args[2], args[3]);
						const embed = new MessageEmbed()
							.setAuthor(message.author.username, message.author.avatarURL())
							.setTitle("Changes Done")
							.setDescription("The changes have successfully been applied. Please note that this command does not check for valid properties/values, make sure the user modded has the correct settings.")
							.setColor("GREEN");
						message.channel.send({ embed });
					}).catch(async () => {
						const guild = bot.guilds.cache.get(args[1]);
						if (guild !== undefined) {
							await guild.changeSetting(args[2], args[3]);
							const embed = new MessageEmbed()
								.setAuthor(message.author.username, message.author.avatarURL())
								.setTitle("Changes Done")
								.setDescription("The changes have successfully been applied. Please note that this command does not check for valid properties/values, make sure the guild modded has the correct settings.")
								.setColor("GREEN");
							message.channel.send({ embed });
						} else {
							const embed = new MessageEmbed()
								.setAuthor(message.author.username, message.author.avatarURL())
								.setTitle("Warning")
								.setDescription(`The ID specified does not correspond to a valid user or a guild where ${bot.user.username} is.`)
								.setColor("ORANGE");
							message.channel.send({ embed });
						}
					});
				} else {
					const embed = new MessageEmbed()
						.setAuthor(message.author.username, message.author.avatarURL())
						.setTitle("Warning")
						.setDescription("You need to specify the value of the settings you want to change.")
						.setColor("ORANGE");
					message.channel.send({ embed });
				}
			} else {
				const embed = new MessageEmbed()
					.setAuthor(message.author.username, message.author.avatarURL())
					.setTitle("Warning")
					.setDescription("You need to specify the property of the settings you want to change.")
					.setColor("ORANGE");
				message.channel.send({ embed });
			}
		} else {
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Warning")
				.setDescription("You need to specify the ID of the user or the guild you want to change the settings of.")
				.setColor("ORANGE");
			message.channel.send({ embed });
		}
	}
};
