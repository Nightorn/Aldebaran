import { MessageEmbed } from "discord.js";
import MessageContext from "../../../structures/contexts/MessageContext.js";
import Command from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";

export default class TimeoutSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Timeouts the specified user",
			perms: { aldebaran: ["BAN_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args.length >= 2) {
			ctx.client.customUsers.fetch(args.shift()!).then(user => {
				const times = {
					y: 31536000000, m: 2628000000, d: 86400000, h: 3600000
				};
				const banTime = args.shift()!.match(/(\d+\s*[ymdh]\b)/ig)!
					.reduce((time: number, str: string) => time + Number(str.match(/(\d+)\s*([ymdh])/i)![1]) * times[RegExp.$2 as keyof typeof times], 0);
				const finalDate = Date.now() + banTime;
				ctx.client.database.users
					.updateOneById(user.id, new Map([["timeout", finalDate]]))
					.then(() => {
						const f = (number: number) => String(number).length === 1 ? `0${number}` : number;
						const getDate = (date: Date) => `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`;
						const embed = new MessageEmbed()
							.setTitle("You have been banned.")
							.setDescription(`It seems you have broken the rules by using ${ctx.client.name} in a wrong way. Because we do not want people to do bad things but instead want ${ctx.client.name} to always operate as well as possible, we have decided to ban you so you do not disturb the other users. You can go in the official server to appeal your ban to the moderator who took action on you. You will be unbanned the ${getDate(new Date(finalDate))}.`)
							.addField("Reason", args.join(" "), true)
							.addField("Server Invite", "https://discord.gg/3x6rXAv", true)
							.setColor("RED")
							.setFooter({
								text: `Action taken by ${ctx.author.user.tag}`,
								iconURL: ctx.author.avatarURL
							});
						user.user.send({ embeds: [embed] });
					}).catch((err: Error) => {
						console.error(err);
						ctx.error("UNEXPECTED_BEHAVIOR", "An error occurred trying to timeout this user.");
					});
			}).catch(err => {
				console.error(err);
				ctx.error(
					"NOT_FOUND",
					"This ID does not correspond to any Discord user. Make sure you did not make a mistake typing it."
				);
			});
		} else {
			ctx.error(
				"INCORRECT_CMD_USAGE",
				"This command requires three arguments in order to work, the user to timeout, the length and the reason of it."
			);
		}
	}
};
