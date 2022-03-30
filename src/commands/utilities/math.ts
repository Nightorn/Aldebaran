import { MessageEmbed } from "discord.js";
import { evaluate } from "mathjs";
import Command from "../../groups/UtilitiesCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { formatNumber } from "../../utils/Methods.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class MathCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Evaluates a math expression",
			example: "sqrt(4) * 2",
			aliases: ["calc"],
			args: {
				expression: { as: "string", desc: "The expression you want to evaluate" }
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const { expression } = ctx.args as { expression: string };

		let result: number | string;
		try {
			result = evaluate(expression.replace(/,/g, ""));
		} catch (err) {
			result = "The specified math expression is invalid.";
		}
		const embed = this.createEmbed(ctx)
			.setTitle("Math Expression Evaluation")
			.addField("Result", `\`\`\`${formatNumber(result)}\`\`\``);
		ctx.reply(embed);
	}
};
