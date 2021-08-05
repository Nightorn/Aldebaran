import { MessageEmbed } from "discord.js";
import { evaluate } from "mathjs";
import { Command, Embed } from "../../groups/UtilitiesCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
import { formatNumber } from "../../utils/Methods.js";

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
	run(_: AldebaranClient, message: Message, args: any) {
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
			message.channel.send({ embed });
		} else {
			const embed = new MessageEmbed()
				.setAuthor("You are using this command incorrectly.")
				.setDescription("You need to specify something to calculate in order to make this command work.")
				.setFooter(message.author.username, message.author.pfp())
				.setColor("RED");
			message.channel.send({ embed });
		}
	}
};
