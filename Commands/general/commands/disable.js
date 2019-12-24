const { Command, Embed } = require("../../../structures/categories/GeneralCategory");
const ErrorEmbed = require("../../../structures/Aldebaran/ErrorEmbed");

module.exports = class DisableCommandsSubcommand extends Command {
	constructor(client) {
		super(client, {
			name: "disable",
			description: "Disables a command for your server",
			subcommand: true,
			perms: {
				discord: ["ADMINISTRATOR"]
			}
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
							const embed = new ErrorEmbed(message)
								.setAuthor("Something went wrong.")
								.setDescription(`An error occured trying to update your settings. Please contact the developers or fill a bug report with \`${message.guild.prefix}bugreport\`.`);
							message.channel.send({ embed });
						});
				}
				const embed = new ErrorEmbed(message)
					.setAuthor("The requested resource has not been found.")
					.setDescription("The command you want to disable is incorrect. Make sure you did not make a mistake when typing it.");
				return message.channel.send({ embed });
			}
			const embed = new ErrorEmbed(message)
				.setAuthor("You are doing something wrong.")
				.setDescription("You are trying to disable a command you have already disabled.");
			return message.channel.send({ embed });
		}
		const embed = new ErrorEmbed(message)
			.setAuthor("You are using this command incorrectly.")
			.setDescription("One or multiple arguments are missing for this command. You need to specify the command you want to disable.");
		return message.channel.send({ embed });
	}
};
