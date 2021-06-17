import { MessageEmbed } from "discord.js";
import { Command } from "../../../groups/DeveloperCommand.js";
import AldebaranPermissions from "../../../structures/aldebaran/AldebaranPermissions.js";

export default class SetpermSubcommand extends Command {
	constructor(client) {
		super(client, {
			description: "Set Aldebaran permissions of the specific user",
			subcommand: true,
			perms: { aldebaran: ["EDIT_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this, no-unused-vars
	run(bot, message, args) {
		if (args[1] === undefined) {
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Warning")
				.setDescription("You need to specify the ID of the user you want to change the permissions of.")
				.setColor("ORANGE");
			message.channel.send({ embed });
			return;
		}
		if (args[2] === undefined) {
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Warning")
				.setDescription("You need to specify the operation you want to perform (ADD or REMOVE)")
				.setColor("ORANGE");
			message.channel.send({ embed });
			return;
		}
		if (args[2].toLowerCase() !== "add" && args[2].toLowerCase() !== "remove") {
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Warning")
				.setDescription("You need to specify either ADD or REMOVE as the operation.")
				.setColor("ORANGE");
			message.channel.send({ embed });
			return;
		}
		if (args[3] === undefined) {
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Warning")
				.setDescription("You need to specify the Aldebaran permissions you want to set (seperated by spaces). (See `assets/data/aldebaranPermissions.json` for valid flags.)")
				.setColor("ORANGE");
			message.channel.send({ embed });
			return;
		}
		bot.users.fetch(args[1]).then(async user => {
			const permissions = args
				.slice(3)
				.filter(
					permission => Object
						.keys(AldebaranPermissions.FLAGS)
						.includes(permission)
				);
			const embedAddSuccess = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Success")
				.setDescription(`Successfully added:\n\`${permissions.join(", ")}\`\n to ${user.username}.`)
				.setColor("GREEN");
			const embedRemoveSuccess = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Success")
				.setDescription(`Successfully removed:\n\`${permissions.join(", ")}\`\n from ${user.username}.`)
				.setColor("GREEN");
			const embedFailure = error => new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Warning")
				.setDescription(`Something went wrong: \n\`${error}\``)
				.setColor("ORANGE");
			switch (args[2].toLowerCase()) {
			case "add":
				try {
					await user.addPermissions(permissions);
					message.channel.send({ embed: embedAddSuccess });
				} catch (err) {
					console.log(err);
					message.channel.send({ embed: embedFailure(err) });
				}
				break;
			case "remove":
				try {
					await user.removePermissions(permissions);
					message.channel.send({ embed: embedRemoveSuccess });
				} catch (err) {
					console.log(err);
					message.channel.send({ embed: embedFailure(err) });
				}
				break;
			default:
				break;
			}
		}).catch(() => {
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Warning")
				.setDescription("The ID specified does not correspond to a valid user.")
				.setColor("ORANGE");
			message.channel.send({ embed });
		});
	}
};
