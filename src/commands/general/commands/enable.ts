import { Command, Embed } from "../../../groups/Command.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../../structures/djs/Client.js";

export default class EnableCommandsSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Enables back a command for your server",
			perms: { discord: ["ADMINISTRATOR"] },
			requiresGuild: true
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const guild = (await ctx.guild())!;
		if (args[0]) {
			if (guild.commandOverrides !== undefined) {
				if (ctx.client.commands.exists(args[0])) {
					return guild.changeCommandSetting(args[0], true)
						.then(() => {
							const embed = new Embed(this)
								.setAuthor("Your settings have been successfully updated.")
								.setDescription(`**${args[0]}** is now enabled again.`);
							ctx.reply(embed);
						}).catch(err => {
							console.error(err);
							ctx.error("UNEXPECTED_BEHAVIOR", "An error occured trying to update your settings.");
						});
				}
				return ctx.error("NOT_FOUND", "The command you want to enable does not exist. Make sure you did not make a mistake when typing it.", "command");
			}
			return ctx.error("WRONG_USAGE", "You are trying to enable a command that is already enabled.");
		}
		return ctx.error("INCORRECT_CMD_USAGE", "One or multiple arguments are missing for this command. You need to specify the command you want to enable.");
	}
};
