import { Command, Embed } from "../../../groups/Command.js";

export default class EnableCommandsSubcommand extends Command {
	constructor(client) {
		super(client, {
			description: "Enables back a command for your server",
			subcommand: true,
			perms: { discord: ["ADMINISTRATOR"] }
		});
	}

	run(bot, message, args) {
		args.shift();
		if (args[0] !== undefined) {
			if (message.guild.commands !== undefined) {
				if (bot.commands.exists(args[0])) {
					return message.guild.changeCommandSetting(args[0], true)
						.then(() => {
							const embed = new Embed(this)
								.setAuthor("Your settings have been successfully updated.")
								.setDescription(`**${args[0]}** is now enabled again.`);
							message.channel.send({ embed });
						}).catch(err => {
							console.error(err);
							message.channel.error("UNEXPECTED_BEHAVIOR", "An error occured trying to update your settings.");
						});
				}
				message.channel.error("NOT_FOUND", "The command you want to enable does not exist. Make sure you did not make a mistake when typing it.", "command");
			}
			message.channel.error("WRONG_USAGE", "You are trying to enable a command that is already enabled.");
		}
		message.channel.error("INCORRECT_CMD_USAGE", "One or multiple arguments are missing for this command. You need to specify the command you want to enable.");
	}
};
