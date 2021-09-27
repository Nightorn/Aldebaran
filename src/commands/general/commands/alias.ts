import { Command, Embed } from "../../../groups/Command.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../../structures/djs/Client.js";

export default class AliasCommandsSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Sets a command alias for your server",
			perms: { discord: ["ADMINISTRATOR"] },
			requiresGuild: true
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const guild = (await ctx.guild())!;
		if (args.length >= 2) {
			if (guild.commandOverrides[args[1]] !== args[0]) {
				if (ctx.client.commands.exists(args[0])) {
					return guild.changeCommandSetting(args[1], args[0])
						.then(() => {
							const embed = new Embed(this)
								.setAuthor("Your settings have been successfully updated.")
								.setDescription(`**${args[1]}** is now an alias of **${args[0]}**. Make use of it by doing \`${guild.prefix}${args[1]}\`!${ctx.client.commands.exists(args[1]) ? `\n:warning: By making this alias, you have disabled the default **${args[1]}** command.` : ""}`);
							return ctx.reply(embed);
						}).catch(err => {
							console.error(err);
							return ctx.error("UNEXPECTED_BEHAVIOR", "An error occured trying to update your settings.");
						});
				}
				return ctx.error("NOT_FOUND", "The command you want to set an alias on is incorrect. Make sure you did not make a mistake when typing it.", "command");
			}
			return ctx.error("WRONG_USAGE", "You are trying to do set an alias that has already been set before.");
		}
		return ctx.error("INCORRECT_CMD_USAGE", `One or multiple arguments are missing for this command. You need to specify both the original command you want to set an alias on and its alias, like \`${guild.prefix}commands alias stats dstats\`.`);
	}
};
