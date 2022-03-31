import { MessageEmbed } from "discord.js";
import Command from "../../groups/FunCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class TimecompletionCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows the week, month, year and decade completions."
		});
	}

	run(ctx: MessageContext) {
		const todaysDate = new Date();
		const d = new Date(todaysDate);
		const day = d.getUTCDay();
		const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
		d.setUTCDate(diff);
		d.setUTCHours(0, 0, 0, 0);
		const monthFirstDay = new Date(todaysDate.getUTCFullYear(),
			todaysDate.getUTCMonth(), 1);
		const monthLastDay = new Date(todaysDate.getUTCFullYear(),
			todaysDate.getUTCMonth() + 1);
		const yearFirstDay = new Date(todaysDate.getUTCFullYear(), 0);
		const yearLastDay = new Date(todaysDate.getUTCFullYear() + 1, 0);
		const weekCompletion = Math.round(1000
			* (100 * (Date.now() - d.getTime()) / 604800000)) / 1000;
		const monthCompletion = Math.round(1000
			* (100 * (Date.now() - monthFirstDay.getTime())
			/ (monthLastDay.getTime() - monthFirstDay.getTime()))) / 1000;
		const yearCompletion = Math.round(1000
			* (100 * (Date.now() - yearFirstDay.getTime())
			/ (yearLastDay.getTime() - yearFirstDay.getTime()))) / 1000;
		const decadeCompletion = Math.round(1000
			* (100 * (Date.now() - 1577836800000)
			/ 315619200000)) / 1000;
		const embed = new MessageEmbed()
			.setAuthor({
				name: "Time Completion",
				iconURL: ctx.client.user.avatarURL()!
			})
			.setColor(this.color)
			.setDescription(`We are **${weekCompletion}%** through the week.\nWe are **${monthCompletion}%** through the month.\nWe are **${yearCompletion}%** through the year.\nWe are **${decadeCompletion}%** through the decade.`);
		ctx.reply(embed);
	}
}
