const { MessageEmbed } = require("discord.js");
const moment = require("moment-timezone");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class TimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "time",
			description: "Prints a user's time based on their configured timezone",
			usage: "UserMention",
			example: "<@143026985763864576>",
			aliases: ["heure"]
		});
	}

	run(bot, message, args) {
		const user = message.mentions.users.size >= 1
			? message.mentions.users.first()
			: message.author;
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
				message.channel.send({
					embed: {
						title: ":x: Ooof!",
						description: `The timezone setting for ${
							user.username
						} seems to be invaild! Tell them to set it again with &uconfig timezone!`,
						fields: [
							{
								name: ":information_source:",
								value: `${
									user.username
								}'s timezone is set to ${timezone}.\nMake sure the timezone is a vaild [tz timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), or in the format: GMT+ or - <number>`
							}
						]
					}
				});
			} else {
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}  |  Date and Time`, user.avatarURL())
					.setDescription(
						`${time.format("dddd, Do of MMMM YYYY")}\n**${time.format(
							"hh:mm:ss A"
						)}**`
					)
					.setColor(this.color);
				if (!args.includes("-c"))
					embed.setFooter(
						"If this is inaccurate, try setting a tz timezone instead of a GMT-based timezone!"
					);
				message.channel.send({ embed });
			}
		} else if (user.equals(message.author)) {
			message.reply(
				`it seems that you do not have configured your timezone. Please check \`${
					message.guild.prefix
				}uconfig\` before retrying.`
			);
		} else {
			message.reply(
				"it seems that the specified user has not configured his timezone yet."
			);
		}
	}
};
