import { Command, Embed } from "../../../groups/Command.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../../structures/djs/Client.js";

export default class DisableCommandsSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Disables a command for your server",
			perms: { discord: ["ADMINISTRATOR"] },
			requiresGuild: true
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const guild = (await ctx.guild())!;
		if (args[0]) {
			if (guild.commandOverrides[args[0]]) {
				if (ctx.client.commands.exists(args[0])
					|| guild.commandOverrides[args[0]]
				) {
					return guild.changeCommandSetting(args[0], false)
						.then(() => {
							const embed = new Embed(this)
								.setAuthor("Your settings have been successfully updated.")
								.setDescription(`**${args[0]}** is now disabled.`);
							ctx.reply(embed);
						}).catch(err => {
							console.error(err);
							ctx.error("UNEXPECTED_BEHAVIOR", "An error occured trying to update your settings.");
						});
				}
				return ctx.error("NOT_FOUND", "The command you want to disable is incorrect. Make sure you did not make a mistake when typing it.", "command");
			}
			return ctx.error("WRONG_USAGE", "You are trying to disable a command that you have already disabled.");
		}
		return ctx.error("INCORRECT_CMD_USAGE", "One or multiple arguments are missing for this command. You need to specify the command you want to disable.");
	}
};
