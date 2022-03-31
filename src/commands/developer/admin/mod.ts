import MessageContext from "../../../structures/contexts/MessageContext.js";
import Command from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";
import { SettingsModel, GuildSetting, UserSetting } from "../../../utils/Constants.js";

export default class ModSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Changes the settings of the specified user or guild",
			perms: { aldebaran: ["EDIT_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args[0]) {
			if (args[1]
				&& (Object.keys(SettingsModel.user).includes(args[1])
				|| Object.keys(SettingsModel.user).includes(args[1]))
			) {
				if (args[3]) {
					ctx.client.customUsers.fetch(args[0]).then(async user => {
						await user.changeSetting(args[1] as UserSetting, args[2]);
						const embed = this.createEmbed(ctx)
							.setTitle("Changes Done")
							.setDescription("The changes have successfully been applied. Please note that this command does not check for valid properties/values, make sure the user modded has the correct settings.")
							.setColor("GREEN");
						ctx.reply(embed);
					}).catch(async () => {
						const guild = await ctx.client.customGuilds.fetch(args[0]);
						if (guild !== undefined) {
							await guild.changeSetting(args[1] as GuildSetting, args[2]);
							const embed = this.createEmbed(ctx)
								.setTitle("Changes Done")
								.setDescription("The changes have successfully been applied. Please note that this command does not check for valid properties/values, make sure the guild modded has the correct settings.")
								.setColor("GREEN");
							ctx.reply(embed);
						} else {
							const embed = this.createEmbed(ctx)
								.setTitle("Warning")
								.setDescription(`The ID specified does not correspond to a valid user or a guild where ${ctx.client.user!.username} is.`)
								.setColor("ORANGE");
							ctx.reply(embed);
						}
					});
				} else {
					const embed = this.createEmbed(ctx)
						.setTitle("Warning")
						.setDescription("You need to specify the value of the settings you want to change.")
						.setColor("ORANGE");
					ctx.reply(embed);
				}
			} else {
				const embed = this.createEmbed(ctx)
					.setTitle("Warning")
					.setDescription("You need to specify the property of the settings you want to change.")
					.setColor("ORANGE");
				ctx.reply(embed);
			}
		} else {
			const embed = this.createEmbed(ctx)
				.setTitle("Warning")
				.setDescription("You need to specify the ID of the user or the guild you want to change the settings of.")
				.setColor("ORANGE");
			ctx.reply(embed);
		}
	}
}
