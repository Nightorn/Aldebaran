import { MessageEmbed } from "discord.js";
import { Command } from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";
import Message from "../../../structures/djs/Message.js";

export default class TimeoutSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Timeouts the specified user",
			perms: { aldebaran: ["BAN_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message, args: any) {
		args.shift();
		if (args.length > 2) {
			bot.users.fetch(args.shift()).then(user => {
				const times: any = {
					y: 31536000000, m: 2628000000, d: 86400000, h: 3600000
				};
				const banTime = args.shift().match(/(\d+\s*[ymdh]\b)/ig)
					.reduce((time: number, str: string) => time + Number(str.match(/(\d+)\s*([ymdh])/i)![1]) * times[RegExp.$2], 0);
				const finalDate = Date.now() + banTime;
				bot.database.users.updateOneById(user.id, new Map([["timeout", finalDate]])).then(() => {
					message.author.timeout = finalDate;
					const f = (number: number) => String(number).length === 1 ? `0${number}` : number;
					const getDate = (date: Date) => `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`;
					const embed = new MessageEmbed()
						.setAuthor("You have been banned.")
						.setDescription(`It seems you have broken the rules by using Aldebaran in a wrong way. Because we do not want people to do bad things but instead want Aldebaran to always operate as well as possible, we have decided to ban you so you do not disturb the other users. You can go in the official server to appeal your ban to the moderator who took action on you. You will be unbanned the ${getDate(new Date(finalDate))}.`)
						.addField("Reason", args.join(" "), true)
						.addField("Server Invite", "https://discord.gg/3x6rXAv", true)
						.setColor("RED")
						.setFooter(`Action taken by ${message.author.tag}`, message.author.pfp());
					user.send({ embed });
				}).catch((err: Error) => {
					console.error(err);
					message.channel.error("UNEXPECTED_BEHAVIOR", "An error occurred trying to timeout this user.");
				});
			}).catch(() => {
				const embed = new MessageEmbed()
					.setAuthor("The requested resource has not been found.")
					.setDescription("This ID does not correspond to any Discord user. Make sure you did not make a mistake typing it.")
					.setColor("RED")
					.setFooter(message.author.username, message.author.pfp());
				message.channel.send({ embed });
			});
		} else {
			const embed = new MessageEmbed()
				.setAuthor("You are using this command incorrectly.")
				.setDescription("This command requires three arguments in order to work, the user to timeout, the length and the reason of it.")
				.setColor("RED")
				.setFooter(message.author.username, message.author.pfp());
			message.channel.send({ embed });
		}
	}
};
