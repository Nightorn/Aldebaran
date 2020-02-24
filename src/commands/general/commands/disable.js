const { Command, Embed } = require("../../../groups/Command");

module.exports = class DisableCommandsSubcommand extends Command {
	constructor(client) {
		super(client, {
			description: "Disables a command for your server",
			subcommand: true,
			perms: { discord: ["ADMINISTRATOR"] }
		});
	}

	run(bot, message, args) {
		args.shift();
		if (args[0] !== undefined) {
			if (message.guild.commands[args[0]] !== false) {
				if (bot.commands.exists(args[0])
					|| message.guild.commands[args[0]] !== undefined
				) {
					return message.guild.changeCommandSetting(args[0], false)
						.then(() => {
							const embed = new Embed(this)
								.setAuthor("Your settings have been successfully updated.")
								.setDescription(`**${args[0]}** is now disabled.`);
							message.channel.send({ embed });
						}).catch(err => {
							console.error(err);
							message.channel.error("UNEXPECTED_BEHAVIOR", "An error occured trying to update your settings.");
						});
				}
				message.channel.error("NOT_FOUND", "The command you want to disable is incorrect. Make sure you did not make a mistake when typing it.", "command");
			}
			message.channel.error("WRONG_USAGE", "You are trying to disable a command that you have already disabled.");
		}
		message.channel.error("INCORRECT_CMD_USAGE", "One or multiple arguments are missing for this command. You need to specify the command you want to disable.");
	}
};
