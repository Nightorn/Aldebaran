import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { categories } from "../../utils/Constants.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class HelpCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays detailled help about Aldebaran's commands"
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args[0] !== undefined) {
			const match = categories[args[0].toLowerCase()];
			const category = typeof match === "string" ? categories[match] : match;
			if (category !== undefined) {
				let list = "";
				const categoryCommands = new Map();
				for (const cmd of ctx.client.commands.commands) {
					categoryCommands.set(...cmd);
				}
				for (const [cmd, data] of categoryCommands) {
					if (data.category === category.name && !data.aliases.includes(cmd)) {
						list += `:small_blue_diamond: **${cmd}** : ${data.shortDesc}\n`;
					}
				}
				const categoryEmbed = new MessageEmbed()
					.setAuthor("Category Help", ctx.client.user.avatarURL()!)
					.setTitle(`${category.title} - ${category.description}`)
					.setDescription(list)
					.setColor(this.color);
				ctx.reply({ embeds: [categoryEmbed] });
			} else if (ctx.client.commands.exists(args[0].toLowerCase())) {
				ctx.reply(
					ctx.client.commands.getHelp(args[0].toLowerCase(), ctx.prefix)
				);
			} else {
				ctx.error("NOT_FOUND", "You are trying to find help for a command or a category that does not exist. Make sure you did not make a typo in your request.");
			}
		} else {
			const embed = new MessageEmbed()
				.setAuthor("Aldebaran's Help Pages", ctx.client.user.avatarURL()!);
			let categoriesList = "";
			for (const [, data] of Object.entries(categories)) {
				if (data.name !== "Developer"  && typeof data !== "string")
					categoriesList += `**${data.title}** - ${data.description}\n`;
			}
			embed.setDescription(
				`Below are the different categories, each of them contains a list of commands which you can see with \`&help <category name>\`. You can get a brief overview of all available commands with \`&commands\`.\n${categoriesList}`
			);
			embed.addField(
				"**__Have a command request or suggestion?__**",
				`Join our support server by clicking [right here](https://discord.gg/3x6rXAv), or use \`${ctx.prefix}suggest\` to suggest something using a command!`,
				true
			);
			ctx.reply(embed);
		}
	}
};
