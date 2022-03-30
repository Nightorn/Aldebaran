import moment from "moment-timezone";
import Command from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { MessageEmbed } from "discord.js";

export default class TimeCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Prints a user's time based on their configured timezone",
			example: "<@143026985763864576>",
			args: {
				user: {
					as: "user",
					desc: "The user whose time you want to know",
					optional: true
				},
				clean: {
					as: "boolean",
					flag: { short: "c", long: "clean" },
					desc: "Whether to remove the footer or not",
					optional: true
				}
			}
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { user?: string, clean?: boolean };
		const user = await ctx.client.customUsers
			.fetch(args.user || ctx.author.id);
		let { timezone } = user.settings;
		if (timezone !== undefined) {
			if (!timezone.includes("/")) {
				const symbol = timezone[3];
				let base = timezone.split(symbol)[0];
				let number = parseInt(timezone.split(symbol)[1], 10);
				if (symbol === "-") number *= -1;
				if (base !== "GMT") {
					if (base === "UTC") base = "GMT";
				}
				timezone = base + symbol + number.toString();
			}
			timezone = timezone.indexOf("+") !== -1
				? timezone.replace("+", "-")
				: timezone.replace("-", "+");
			if (/^GMT(\+|-)\d{1,2}/i.test(timezone)) timezone = `ETC/${timezone}`;
			const time = moment().tz(timezone);
			if (time === null) {
				const embed = new MessageEmbed()
					.setTitle(":x: Ooof!")
					.setColor("RED")
					.setDescription(`The timezone setting for ${user.username} seems to be invaild! Tell them to set it again with ${ctx.prefix}uconfig timezone!`)
					.addField(":information_source:", `${
						user.username
					}'s timezone is set to ${timezone}.\nMake sure the timezone is a vaild [tz timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), or in the format: GMT+ or - <number>`);
				ctx.reply(embed);
			} else {
				const date = time.format("dddd, Do of MMMM YYYY");
				const subDate = time.format("hh:mm:ss A");
				const embed = this.createEmbed(ctx)
					.setAuthor({
						name: `${user.username}  |  Date and Time`,
						iconURL: user.user.displayAvatarURL()
					})
					.setDescription(`${date}\n**${subDate}**`);
				if (!args.clean)
					embed.setFooter({
						text: "If this is inaccurate, try setting a tz timezone instead of a GMT-based timezone!"
					});
				ctx.reply(embed);
			}
		} else if (user.user.equals(ctx.author.user)) {
			ctx.reply(
				`it seems that you do not have configured your timezone. Please check \`${
					ctx.prefix
				}uconfig\` before retrying.`
			);
		} else {
			ctx.reply("it seems that the specified user has not configured his timezone yet.");
		}
	}
};
