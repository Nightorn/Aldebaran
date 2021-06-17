import { MessageEmbed } from "discord.js";
import { Command } from "../../../groups/DeveloperCommand.js";

export default class ClearSubcommand extends Command {
	constructor(client) {
		super(client, {
			description: "Clears the data of the specified user or server",
			subcommand: true,
			perms: { aldebaran: ["EDIT_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const id = message.mentions.members.size === 1
			? message.mentions.members.first().id : args[1];
		bot.users.fetch(id).then(user => {
			message.channel.send(`**${message.author.username}**, are you sure you want to clear the data of **${user.username}**?`).then(msg => {
				msg.react("✅");
				const check = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
				msg.awaitReactions(check, { time: 30000, max: 1, errors: ["time"] }).then(() => {
					user.clear(user.id).then(() => {
						message.channel.send(`The user data of **${user.username}** has been successfully deleted.`);
					});
				}).catch(() => {
					msg.reactions.removeAll().catch(() => {});
					msg.edit(`The data deletion of **${user.username}** has been cancelled.`);
				});
			});
		}).catch(() => {
			const guild = bot.guilds.cache.get(id);
			if (guild !== undefined) {
				message.channel.send(`**${message.author.username}**, are you sure you want to clear the data of **${guild.name}**?`).then(msg => {
					msg.react("✅");
					const check = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
					msg.awaitReactions(check, { time: 30000, max: 1, errors: ["time"] }).then(() => {
						guild.clear(guild.id).then(() => {
							message.channel.send(`The guild data of **${guild.name}** has been successfully deleted.`);
						});
					}).catch(() => {
						msg.reactions.removeAll().catch(() => {});
						msg.edit(`The data deletion of **${guild.name}** has been cancelled.`);
					});
				});
			} else {
				const embed = new MessageEmbed()
					.setAuthor(message.author.username, message.author.avatarURL())
					.setTitle("Warning")
					.setDescription(`The ID specified does not correspond to a valid user or a guild where ${bot.user.username} is.`)
					.setColor("ORANGE");
				message.channel.send({ embed });
			}
		});
	}
};
