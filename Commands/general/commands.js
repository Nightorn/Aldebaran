const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class CommandsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "commands",
			description: "Lists all the available commands"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const commands = {};
		let amount = 0;
		let amountShown = 0;
		const hiddenBypass = args.includes("--show-hidden");
		const hideAliases = args.includes("--hide-aliases");
		for (const [name, data] of bot.commands.commands) {
			amount++;
			if (data.check(message)) {
				if (!data.hidden || hiddenBypass) {
					if (commands[data.category] === undefined)
						commands[data.category] = [];
					if (name === data.name) {
						amountShown++;
						commands[data.category].push(name);
					} else if (!hideAliases) {
						amountShown++;
						commands[data.category].push(`*${name}*`);
					}
				}
			}
		}

		const embed = new MessageEmbed()
			.setAuthor(
				`Aldebaran  |  List of ${amountShown}/${amount} commands`,
				bot.user.avatarURL()
			)
			.setColor(message.guild.me.displayColor);
		if (!hiddenBypass && !hideAliases) {
			embed.setFooter(
				"Use --show-hidden to view all commands and --hide-aliases to hide aliases."
			);
		}
		for (const [category, list] of Object.entries(commands)) {
			embed.addField(category, list.join(", "), true);
		}
		message.channel.send({ embed });
	}
};
