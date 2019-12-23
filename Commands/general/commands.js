const { Command, Embed } = require("../../structures/categories/GeneralCategory");

module.exports = class CommandsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "commands",
			description: "Lists all the available commands",
			allowIndexCommand: true,
			allowUnknownSubcommands: true
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
				if ((!data.hidden || hiddenBypass)
					&& message.guild.commands[name] !== false
				) {
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
		for (const [name, data] of Object.entries(message.guild.commands)) {
			if (data !== false) {
				amount++;
				amountShown++;
				commands[bot.commands.get(data).category].push(`**${name}**`);
			} else commands[bot.commands.get(name).category].push(`~~${name}~~`);
		}

		const embed = new Embed(this)
			.setAuthor(
				`Aldebaran  |  List of ${amountShown}/${amount} commands`,
				bot.user.avatarURL()
			);
		embed.setFooter(`${!hiddenBypass && !hideAliases ? "Use --show-hidden to view all commands and --hide-aliases to hide aliases." : ""} To learn how to use the customized commands, check ${message.guild.prefix}commands guide.`);
		for (const [category, list] of Object.entries(commands)) {
			embed.addField(category, list.join(", "), true);
		}
		message.channel.send({ embed });
	}
};
