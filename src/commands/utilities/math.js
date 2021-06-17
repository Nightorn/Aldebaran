import { MessageEmbed } from "discord.js";
import mathjs from "mathjs";
import { Command, Embed } from "../../groups/UtilitiesCommand.js";

export default class MathCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Evaluates a math expression",
			usage: "Expression",
			example: "sqrt(4) * 2",
			aliases: ["calc"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args.length !== 0) {
			let result;
			try {
				result = args.join(" ") === "10 + 9" || args.join(" ") === "10+9"
					? 21
					: mathjs.eval(args.join(" ").replace(/,/g, ""));
			} catch (err) {
				result = "The specified math expression is invalid.";
			}
			const embed = new Embed(this)
				.setTitle("Math Expression Evaluation")
				.addField("Result", `\`\`\`${Number.formatNumber(result)}\`\`\``);
			message.channel.send({ embed });
		} else {
			const embed = new MessageEmbed()
				.setAuthor("You are using this command incorrectly.")
				.setDescription("You need to specify something to calculate in order to make this command work.")
				.setFooter(message.author.username, message.author.avatarURL())
				.setColor("RED");
			message.channel.send({ embed });
		}
	}
};
