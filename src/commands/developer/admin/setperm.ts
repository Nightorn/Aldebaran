import { MessageEmbed } from "discord.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";
import { PermissionString } from "../../../utils/Constants.js";
import { Command } from "../../../groups/DeveloperCommand.js";
import AldebaranPermissions from "../../../structures/aldebaran/AldebaranPermissions.js";
import AldebaranClient from "../../../structures/djs/Client.js";

export default class SetpermSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Set permissions of the specific user",
			perms: { aldebaran: ["MANAGE_PERMISSIONS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this, no-unused-vars
	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args[0] === undefined) {
			const embed = new MessageEmbed()
				.setAuthor(
					ctx.message.author.username,
					ctx.message.author.displayAvatarURL()
				)
				.setTitle("Warning")
				.setDescription("You need to specify the ID of the user you want to change the permissions of.")
				.setColor("ORANGE");
			return ctx.reply(embed);
		}
		if (args[1] === undefined) {
			const embed = new MessageEmbed()
				.setAuthor(
					ctx.message.author.username,
					ctx.message.author.displayAvatarURL()
				)
				.setTitle("Warning")
				.setDescription("You need to specify the operation you want to perform (ADD or REMOVE)")
				.setColor("ORANGE");
			return ctx.reply(embed);
		}
		if (args[1].toLowerCase() !== "add" && args[1].toLowerCase() !== "remove") {
			const embed = new MessageEmbed()
				.setAuthor(
					ctx.message.author.username,
					ctx.message.author.displayAvatarURL()
				)
				.setTitle("Warning")
				.setDescription("You need to specify either ADD or REMOVE as the operation.")
				.setColor("ORANGE");
			return ctx.reply(embed);
		}
		if (args[2] === undefined) {
			const embed = new MessageEmbed()
				.setAuthor(
					ctx.message.author.username,
					ctx.message.author.displayAvatarURL()
				)
				.setTitle("Warning")
				.setDescription(`You need to specify the ${ctx.client.name} permissions you want to set (seperated by spaces). (See \`assets/data/aldebaranPermissions.json\` for valid flags.)`)
				.setColor("ORANGE");
			return ctx.reply(embed);
		}
		return ctx.client.customUsers.fetch(args[0]).then(async user => {
			const permissions = args.slice(2).filter(permission => Object
				.keys(AldebaranPermissions.FLAGS)
				.includes(permission)) as PermissionString[];
			const embedFailure = (error: Error) => new MessageEmbed()
				.setAuthor(
					ctx.message.author.username,
					ctx.message.author.displayAvatarURL()
				)
				.setTitle("Warning")
				.setDescription(`Something went wrong: \n\`${error}\``)
				.setColor("ORANGE");
			switch (args[1].toLowerCase()) {
				case "add":
					try {
						await user.addPermissions(permissions);
						const embedAddSuccess = new MessageEmbed()
							.setAuthor(
								ctx.message.author.username,
								ctx.message.author.displayAvatarURL()
							)
							.setTitle("Success")
							.setDescription(`Successfully added:\n\`${permissions.join(", ")}\`\n to ${user.username}.`)
							.setColor("GREEN");
						ctx.reply(embedAddSuccess);
					} catch (err) {
						console.log(err);
						ctx.reply(embedFailure(err as Error));
					}
					break;
				case "remove":
					try {
						await user.removePermissions(permissions);
						const embedRemoveSuccess = new MessageEmbed()
							.setAuthor(
								ctx.message.author.username,
								ctx.message.author.displayAvatarURL()
							)
							.setTitle("Success")
							.setDescription(`Successfully removed:\n\`${permissions.join(", ")}\`\n from ${user.username}.`)
							.setColor("GREEN");
						ctx.reply(embedRemoveSuccess);
					} catch (err) {
						console.log(err);
						ctx.reply(embedFailure(err as Error));
					}
					break;
				default:
					break;
			}
		}).catch(() => {
			const embed = new MessageEmbed()
				.setAuthor(
					ctx.message.author.username,
					ctx.message.author.displayAvatarURL()
				)
				.setTitle("Warning")
				.setDescription("The ID specified does not correspond to a valid user.")
				.setColor("ORANGE");
			ctx.reply(embed);
		});
	}
};
