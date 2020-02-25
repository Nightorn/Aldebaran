const { Command, Embed } = require("../../../structures/categories/GeneralCategory");
const ErrorEmbed = require("../../../structures/Aldebaran/ErrorEmbed");

module.exports = class AliasCommandsSubcommand extends Command {
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
								const embed = new ErrorEmbed(message)
									.setAuthor("Something went wrong.")
									.setDescription(`An error occured trying to update your settings. Please contact the developers or fill a bug report with \`${message.guild.prefix}bugreport\`.`);
								message.channel.send({ embed });
							});
					}
					const embed = new ErrorEmbed(message)
						.setAuthor("The requested resource has not been found.")
						.setDescription("The command you want to set an alias on is incorrect. Make sure you did not make a mistake when typing it.");
					return message.channel.send({ embed });
				}
				const embed = new ErrorEmbed(message)
					.setAuthor("You are doing something wrong.")
					.setDescription("You are trying to do something that has already been done before.");
				return message.channel.send({ embed });
			}
		}
		const embed = new ErrorEmbed(message)
			.setAuthor("You are using this command incorrectly.")
			.setDescription(`One or multiple arguments are missing for this command. You need to specify both the original command you want to set an alias on and its alias, like \`${message.guild.prefix}commands alias stats dstats\`.`);
		return message.channel.send({ embed });
	}
};
