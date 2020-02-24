const { Command, Embed } = require("../../../groups/Command");
const ErrorEmbed = require("../../../errors/ErrorEmbed");

module.exports = class EnableCommandsSubcommand extends Command {
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
							const embed = new ErrorEmbed(message)
								.setAuthor("Something went wrong.")
								.setDescription(`An error occured trying to update your settings. Please contact the developers or fill a bug report with \`${message.guild.prefix}bugreport\`.`);
							message.channel.send({ embed });
						});
				}
				const embed = new ErrorEmbed(message)
					.setAuthor("The requested resource has not been found.")
					.setDescription("The command you want to enable does not exist. Make sure you did not make a mistake when typing it.");
				return message.channel.send({ embed });
			}
			const embed = new ErrorEmbed(message)
				.setAuthor("You are doing something wrong.")
				.setDescription("You are trying to enable a command that is already enabled.");
			return message.channel.send({ embed });
		}
		const embed = new ErrorEmbed(message)
			.setAuthor("You are using this command incorrectly.")
			.setDescription("One or multiple arguments are missing for this command. You need to specify the command you want to enable.");
		return message.channel.send({ embed });
	}
};
