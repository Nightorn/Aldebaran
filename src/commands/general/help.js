const { MessageEmbed } = require("discord.js");
const categories = require("../../../assets/data/categories.json");
const { Command } = require("../../groups/Command");

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays detailled help about Aldebaran's commands"
		});
	}

	run(bot, message, args) {
		if (args[0] !== undefined) {
			const category = categories[args[0].toLowerCase()];
			if (category !== undefined) {
				let list = "";
				const categoryCommands = new Map();
				for (const cmd of bot.commands.commands) categoryCommands.set(...cmd);
				for (const [command, data] of categoryCommands)
					if (data.category === category.name && !data.aliases.includes(command))
						list += `:small_blue_diamond: **${command}** : ${data.shortDesc}\n`;
				const categoryEmbed = new MessageEmbed()
					.setAuthor("Category Help", bot.user.avatarURL())
					.setTitle(`${category.title} - ${category.description}`)
					.setDescription(list)
					.setColor(this.color);
				message.channel.send({ embed: categoryEmbed });
			} else if (bot.commands.exists(args[0].toLowerCase())) {
				message.channel.send({
					embed: bot.commands.getHelp(args[0].toLowerCase(), message.prefix)
				});
			} else {
				message.channel.error("NOT_FOUND", "You are trying to find help for a command or a category that does not exist. Make sure you did not make a typo in your request.");
			}
		} else {
			const embed = new MessageEmbed()
				.setAuthor("Aldebaran's Help Pages", bot.user.avatarURL());
			let categoriesList = "";
			for (const [, data] of Object.entries(categories)) {
				if (data.name !== "Developer")
					categoriesList += `**${data.title}** - ${data.description}\n`;
			}
			embed.setDescription(
				`Below are the different categories, each of them contains a list of commands which you can see with \`&help <category name>\`. You can get a brief overview of all available commands with \`&commands\`.\n${categoriesList}`
			);
			embed.addField(
				"**__Have a command request or suggestion?__**",
				`Join our support server by clicking [right here](https://discord.gg/3x6rXAv), or use \`${message.guild.prefix}suggest\` to suggest something using a command!`,
				true
			);
			message.channel.send({ embed });
		}
	}
};
