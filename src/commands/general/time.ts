import moment from "moment-timezone";
import { Command, Embed } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class TimeCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Prints a user's time based on their configured timezone",
			example: "<@143026985763864576>",
			args: {
				user: { as: "user?" },
				clean: { as: "boolean?", flag: { short: "c", long: "clean" }, desc: "Whether to remove the footer or not" }
			}
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { user?: string, clean?: boolean };
		const user = await ctx.client.customUsers
			.fetch(args.user || ctx.message.author.id);
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
				const embed = new Embed(this)
					.setTitle(":x: Ooof!")
					.setDescription(`The timezone setting for ${user.username} seems to be invaild! Tell them to set it again with &uconfig timezone!`)
					.addField(":information_source:", `${
						user.username
					}'s timezone is set to ${timezone}.\nMake sure the timezone is a vaild [tz timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), or in the format: GMT+ or - <number>`);
				ctx.reply(embed);
			} else {
				const embed = new Embed(this)
					.setAuthor(`${user.username}  |  Date and Time`, user.user.displayAvatarURL())
					.setDescription(
						`${time.format("dddd, Do of MMMM YYYY")}\n**${time.format(
							"hh:mm:ss A"
						)}**`
					);
				if (!args.clean)
					embed.setFooter("If this is inaccurate, try setting a tz timezone instead of a GMT-based timezone!");
				ctx.reply(embed);
			}
		} else if (user.user.equals(ctx.message.author)) {
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
