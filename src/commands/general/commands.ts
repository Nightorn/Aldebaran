import Command from "../../groups/Command.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { Platform } from "../../utils/Constants.js";

export default class CommandsCommand extends Command {
	constructor() {
		super({
			description: "Lists all the available commands",
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
	}

	async run(ctx: MessageContext, platform: Platform) {
		const args = ctx.args as { showHidden: boolean, hideAliases: boolean };
		const categories: { [key: string]: string[] } = {};
		const commands = ctx.client.commands.commands
			.filter(c => c.supports(platform));
		let count = 0;
		for (const command of commands) {
			if (
				args.showHidden
				|| (await command.check(ctx, platform) && !command.hidden)
			) {
				if (!categories[command.category]) {
					categories[command.category] = [];
				}
				categories[command.category].push(`${command.name}`);
				count++;
				if (!args.hideAliases) {
					command.aliases.forEach(a => {
						categories[command.category].push(`*${a}*`);
					});
				}
			}
		}

		const embed = this.createEmbed().setTitle(`List of ${count} commands`);
		if (!args.showHidden && !args.hideAliases) {
			embed.setFooter({
				text: "Use --showhidden to view all commands and --hidealiases to hide aliases."
			});
		}
		for (const [category, list] of Object.entries(categories)) {
			embed.addField(category, list.join(", "), true);
		}
		ctx.reply(embed);
	}
}
