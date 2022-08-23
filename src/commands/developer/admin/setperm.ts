import MessageContext from "../../../structures/contexts/MessageContext.js";
import { PermissionString } from "../../../utils/Constants.js";
import Command from "../../../groups/DeveloperCommand.js";
import AldebaranPermissions from "../../../structures/AldebaranPermissions.js";

export default class SetpermSubcommand extends Command {
	constructor() {
		super({
			description: "Set permissions of the specific user",
			perms: { aldebaran: ["MANAGE_PERMISSIONS"] }
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args[0] === undefined) {
			const embed = this.createEmbed()
				.setTitle("Warning")
				.setDescription("You need to specify the ID of the user you want to change the permissions of.")
				.setColor("ORANGE");
			return ctx.reply(embed);
		}
		if (args[1] === undefined) {
			const embed = this.createEmbed()
				.setTitle("Warning")
				.setDescription("You need to specify the operation you want to perform (ADD or REMOVE)")
				.setColor("ORANGE");
			return ctx.reply(embed);
		}
		if (args[1].toLowerCase() !== "add" && args[1].toLowerCase() !== "remove") {
			const embed = this.createEmbed()
				.setTitle("Warning")
				.setDescription("You need to specify either ADD or REMOVE as the operation.")
				.setColor("ORANGE");
			return ctx.reply(embed);
		}
		if (args[2] === undefined) {
			const embed = this.createEmbed()
				.setTitle("Warning")
				.setDescription(`You need to specify the ${ctx.client.name} permissions you want to set (seperated by spaces). (See \`assets/data/aldebaranPermissions.json\` for valid flags.)`)
				.setColor("ORANGE");
			return ctx.reply(embed);
		}
		return ctx.fetchUser(args[0]).then(async user => {
			const permissions = args.slice(2).filter(permission => Object
				.keys(AldebaranPermissions.FLAGS)
				.includes(permission)) as PermissionString[];
			const embedFailure = (error: Error) => this.createEmbed()
				.setTitle("Warning")
				.setDescription(`Something went wrong: \n\`${error}\``)
				.setColor("ORANGE");
			switch (args[1].toLowerCase()) {
				case "add":
					try {
						await user.base.addPermissions(permissions);
						const embedAddSuccess = this.createEmbed()
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
						await user.base.removePermissions(permissions);
						const embedRemoveSuccess = this.createEmbed()
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
			const embed = this.createEmbed()
				.setTitle("Warning")
				.setDescription("The ID specified does not correspond to a valid user.")
				.setColor("ORANGE");
			ctx.reply(embed);
		});
	}
}
