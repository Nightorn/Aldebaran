import { Command, Embed } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

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
				showHidden: {
					as: "boolean",
					flag: { short: "s", long: "showhidden" },
					desc: "Show hidden commands",
					optional: true
				},
				hideAliases: {
					as: "boolean",
					flag: { short: "h", long: "hidealiases" },
					desc: "Hide aliases",
					optional: true
				}
			}
		});
		this.registerSubcommands(alias, disable, enable, guide);
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as { showHidden: boolean, hideAliases: boolean };
		const guild = ctx.message.guild ? await ctx.guild() : null;
		const commands: { [key: string]: string[] } = {};
		for (const [name, data] of ctx.client.commands.commands) {
			if (args.showHidden || (await data.check(ctx) && !data.hidden)) {
				if (commands[data.category] === undefined)
					commands[data.category] = [];
				if (name === data.name) {
					commands[data.category].push(name);
				} else if (!args.hideAliases) {
					commands[data.category].push(`*${name}*`);
				}
			}
		}

		if (guild && guild.commandOverrides) {
			for (const [name, data] of Object.entries(guild.commandOverrides)) {
				if (data !== false) {
					commands[ctx.client.commands.get(data)!.category].push(`**${name}**`);
				} else {
					commands[ctx.client.commands.get(name)!.category].push(`~~${name}~~`);
				}
			}
		}

		const embed = new Embed(this)
			.setAuthor(
				`${ctx.client.name}  |  List of ${ctx.client.commands.size} commands`,
				ctx.client.user.avatarURL()!
			);
		embed.setFooter(`${!args.showHidden && !args.hideAliases ? "Use --show-hidden to view all commands and --hidealiases to hide aliases." : ""} To learn how to use the customized commands, check ${ctx.prefix}commands guide.`);
		for (const [category, list] of Object.entries(commands)) {
			embed.addField(category, list.join(", "), true);
		}
		ctx.reply(embed);
	}
};
