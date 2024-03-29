import Command from "../../groups/Command.js";
import { categories, Platform } from "../../utils/Constants.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const emoji = ":small_blue_diamond:";

export default class HelpCommand extends Command {
	constructor() {
		super({
			description: "Displays detailled help about the bot's commands",
			args: { query: {
				as: "string",
				desc: "The command or command category whose details you want to see",
				optional: true
			} }
		});
	}

	async run(ctx: MessageContext, platform: Platform) {
		const { query } = ctx.args as { query?: string };
		if (query) {
			const command = query.toLowerCase();
			const match = categories[command];
			const category = typeof match === "string" ? categories[match] : match;
			if (category !== undefined) {
				const list = ctx.client.commands.commands
					.filter(c => (c.category === category.name || c.matches(command))
						&& c.supports(platform))
					.reduce((acc, c) => `${acc}${emoji} **${c.name}** : ${c.shortDesc}\n`, "");
				const categoryEmbed = this.createEmbed()
					.setTitle(`${category.title} - ${category.description}`)
					.setDescription(list)
					.setColor(this.color);
				ctx.reply(categoryEmbed);
			} else if (ctx.client.commands.exists(command, platform)) {
				const cmd = ctx.client.commands.get(command, platform) as Command;
				ctx.reply(cmd.toHelpEmbed());
			} else {
				ctx.error("NOT_FOUND", "You are trying to find help for a command or a category that does not exist. Make sure you did not make a typo in your request.");
			}
		} else {
			const embed = this.createEmbed()
				.setTitle(`${ctx.client.name}'s Help Pages`);
			let categoriesList = "";
			for (const [, data] of Object.entries(categories)) {
				if (data.name !== "Developer"  && typeof data !== "string")
					categoriesList += `**${data.title}** - ${data.description}\n`;
			}
			embed.setDescription(
				`Below are the different categories, each of them contains a list of commands which you can see with \`${ctx.prefix}help <category name>\`. You can get a brief overview of all available commands with \`${ctx.prefix}commands\`.\n${categoriesList}`
			);
			embed.addField(
				"**__Have a command request or suggestion?__**",
				`Join our support server by clicking [right here](https://discord.gg/3x6rXAv), or use \`${ctx.prefix}suggest\` to suggest something using a command!`,
				true
			);
			ctx.reply(embed);
		}
	}
}
