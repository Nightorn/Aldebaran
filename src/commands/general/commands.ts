import { Command, Embed } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

import alias from "./commands/alias.js";
import disable from "./commands/disable.js";
import enable from "./commands/enable.js";
import guide from "./commands/guide.js";

export default class CommandsCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Lists all the available commands",
			allowIndexCommand: true,
			allowUnknownSubcommands: true,
			args: {
				showHidden: { as: "boolean?", flag: { short: "s", long: "show-hidden" }, desc: "Show hidden commands" },
				hideAliases: { as: "boolean?", flag: { short: "h", long: "hide-aliases" }, desc: "Hide aliases" }
			}
		});
		this.registerSubcommands(alias, disable, enable, guide);
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message, args: any) {
		const commands: { [key: string]: string[] } = {};
		for (const [name, data] of bot.commands.commands) {
			if (data.check(message)) {
				if ((!data.hidden || args.showHidden)
					&& message.guild.commands[name] !== false
				) {
					if (commands[data.category] === undefined)
						commands[data.category] = [];
					if (name === data.name) {
						commands[data.category].push(name);
					} else if (!args.hideAliases) {
						commands[data.category].push(`*${name}*`);
					}
				}
			}
		}
		for (const [name, data] of Object.entries(message.guild.commands)) {
			if (data !== false) {
				commands[bot.commands.get(data)!.category].push(`**${name}**`);
			} else commands[bot.commands.get(name)!.category].push(`~~${name}~~`);
		}

		const embed = new Embed(this)
			.setAuthor(
				`Aldebaran  |  List of ${bot.commands.size} commands`,
				bot.user!.avatarURL()!
			);
		embed.setFooter(`${!args.showHidden && !args.hideAliases ? "Use --show-hidden to view all commands and --hide-aliases to hide aliases." : ""} To learn how to use the customized commands, check ${message.guild.prefix}commands guide.`);
		for (const [category, list] of Object.entries(commands)) {
			embed.addField(category, list.join(", "), true);
		}
		message.channel.send({ embed });
	}
};
