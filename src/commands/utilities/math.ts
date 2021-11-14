import { MessageEmbed } from "discord.js";
import { evaluate } from "mathjs";
import { Command, Embed } from "../../groups/UtilitiesCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { formatNumber } from "../../utils/Methods.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class MathCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Evaluates a math expression",
			usage: "Expression",
			example: "sqrt(4) * 2",
			aliases: ["calc"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args.length !== 0) {
			let result: number | string;
			try {
				result = args.join(" ") === "10 + 9" || args.join(" ") === "10+9"
					? 21
					: evaluate(args.join(" ").replace(/,/g, ""));
			} catch (err) {
				result = "The specified math expression is invalid.";
			}
			const embed = new Embed(this)
				.setTitle("Math Expression Evaluation")
				.addField("Result", `\`\`\`${formatNumber(result)}\`\`\``);
			ctx.reply(embed);
		} else {
			const embed = new MessageEmbed()
				.setAuthor("You are using this command incorrectly.")
				.setDescription("You need to specify something to calculate in order to make this command work.")
				.setFooter(
					ctx.message.author.username,
					ctx.message.author.displayAvatarURL()
				)
				.setColor("RED");
			ctx.reply(embed);
		}
	}
};
