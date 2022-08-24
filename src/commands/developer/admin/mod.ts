import MessageContext from "../../../structures/contexts/MessageContext.js";
import Command from "../../../groups/DeveloperCommand.js";
import { SettingsModel, ServerSettingKey, UserSettingKey } from "../../../utils/Constants.js";

export default class ModSubcommand extends Command {
	constructor() {
		super({
			description: "Changes the settings of the specified user or guild",
			perms: { aldebaran: ["EDIT_USERS"] }
		});
	}

	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args[0]) {
			if (args[1]
				&& (Object.keys(SettingsModel.user).includes(args[1])
				|| Object.keys(SettingsModel.user).includes(args[1]))
			) {
				if (args[3]) {
					ctx.fetchUser(args[0]).then(async user => {
						user.base.setSetting(args[1] as UserSettingKey, args[2]);
						const embed = this.createEmbed()
							.setTitle("Changes Done")
							.setDescription("The changes have successfully been applied. Please note that this command does not check for valid properties/values, make sure the user modded has the correct settings.")
							.setColor("Green");
						ctx.reply(embed);
					}).catch(async () => {
						const guild = await ctx.fetchServer(args[0]);
						if (guild) {
							guild.base.setSetting(args[1] as ServerSettingKey, args[2]);
							const embed = this.createEmbed()
								.setTitle("Changes Done")
								.setDescription("The changes have successfully been applied. Please note that this command does not check for valid properties/values, make sure the guild modded has the correct settings.")
								.setColor("Green");
							ctx.reply(embed);
						} else {
							const embed = this.createEmbed()
								.setTitle("Warning")
								.setDescription(`The ID specified does not correspond to a valid user or a guild where ${ctx.client.name} is.`)
								.setColor("Orange");
							ctx.reply(embed);
						}
					});
				} else {
					const embed = this.createEmbed()
						.setTitle("Warning")
						.setDescription("You need to specify the value of the settings you want to change.")
						.setColor("Orange");
					ctx.reply(embed);
				}
			} else {
				const embed = this.createEmbed()
					.setTitle("Warning")
					.setDescription("You need to specify the property of the settings you want to change.")
					.setColor("Orange");
				ctx.reply(embed);
			}
		} else {
			const embed = this.createEmbed()
				.setTitle("Warning")
				.setDescription("You need to specify the ID of the user or the guild you want to change the settings of.")
				.setColor("Orange");
			ctx.reply(embed);
		}
	}
}
