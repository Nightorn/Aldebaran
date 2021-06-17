import { Command, Embed } from "../../../groups/Command.js";

export default class AliasCommandsSubcommand extends Command {
	constructor(client) {
		super(client, {
			description: "Sets a command alias for your server",
			subcommand: true,
			perms: { discord: ["ADMINISTRATOR"] }
		});
	}

	run(bot, message, args) {
		args.shift();
		if (args[0] !== undefined) {
			if (args[1] !== undefined) {
				if (message.guild.commands[args[1]] !== args[0]) {
					if (bot.commands.exists(args[0])) {
						return message.guild.changeCommandSetting(args[1], args[0])
							.then(() => {
								const embed = new Embed(this)
									.setAuthor("Your settings have been successfully updated.")
									.setDescription(`**${args[1]}** is now an alias of **${args[0]}**. Make use of it by doing \`${message.guild.prefix}${args[1]}\`!${bot.commands.exists(args[1]) ? `\n:warning: By making this alias, you have disabled the default **${args[1]}** command.` : ""}`);
								message.channel.send({ embed });
							}).catch(err => {
								console.error(err);
								message.channel.error("UNEXPECTED_BEHAVIOR", "An error occured trying to update your settings.");
							});
					}
					message.channel.error("NOT_FOUND", "The command you want to set an alias on is incorrect. Make sure you did not make a mistake when typing it.", "command");
				}
				message.channel.error("WRONG_USAGE", "You are trying to do set an alias that has already been set before.");
			}
		}
		message.channel.error("INCORRECT_CMD_USAGE", `One or multiple arguments are missing for this command. You need to specify both the original command you want to set an alias on and its alias, like \`${message.guild.prefix}commands alias stats dstats\`.`);
	}
};
