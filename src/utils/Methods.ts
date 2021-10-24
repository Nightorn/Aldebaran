import { Collection, MessageReaction, User } from "discord.js";
import { readFileSync } from "fs";
import moment from "moment-timezone";
import MessageContext from "../structures/aldebaran/MessageContext";

const timeNames = moment.tz.names();

// export const escape = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

// With the contribution of holroy
export const formatNumber = (n: number | string) => {
	const parts = n.toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		+ (parts[1] ? `.${parts[1]}` : "");
};

export const getDateWithTimezone = (
	date: Date, format: string, userTimezone: string = "UTC"
) => {
	let timezone;
	if (userTimezone.indexOf("/") === -1) {
		const symbol = userTimezone[3];
		let base = userTimezone.split(symbol)[0];
		let number = parseInt(userTimezone.split(symbol)[1], 10);
		if (symbol === "-") number *= -1;
		if (base !== "GMT") {
			if (base === "UTC") base = "GMT";
		}
		timezone = base + symbol + number.toString();
		if (timezone !== undefined) {
			timezone = timezone.indexOf("+") !== -1
				? timezone.replace("+", "-")
				: timezone.replace("-", "+");
			if (/^GMT(\+|-)\d{1,2}/i.test(timezone)) timezone = `ETC/${timezone}`;
		}
	} else timezone = userTimezone;
	const time = moment(date);
	return time.format(format);
};

export const getTimeString = (timeInMs: number, format: string) => {
	const days = Math.floor(timeInMs / 86400000);
	const hours = Math.floor((timeInMs / 3600000) % 24);
	const minutes = Math.floor((timeInMs / 60000) % 60);
	const seconds = Math.floor((timeInMs / 1000) % 60);

	format = format.replace("DD", days.toString());
	format = format.replace("HH", hours < 10 ? `0${hours.toString()}` : hours.toString());
	format = format.replace("MM", minutes < 10 ? `0${minutes.toString()}` : minutes.toString());
	format = format.replace("SS", seconds < 10 ? `0${seconds.toString()}` : seconds.toString());
	return format;
};

export const importAssets = (path: string) => JSON
	.parse(readFileSync(path).toString());

export const lightOrDark = (color: string) => {
	let r;
	let g;
	let b;

	const matches = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
	if (matches) {
		r = Number(matches[1]);
		g = Number(matches[2]);
		b = Number(matches[3]);
	} else {
		const hex = +(`0x${color.slice(1).replace((color.length < 5 && /./g).toString(), "$&$&")}`);
		r = hex >> 16;
		g = hex >> 8 & 255;
		b = hex & 255;
	}

	const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
	if (hsp > 127.5) {
		return true;
	}
	return false;
};

/**
 * Paginates a list for user convenience
 * @param {Array<String>} list The array of items to be paginated
 * @param {Number} page The page number to start on
 * @param {String} headerText The text on the top line of the page
 * @param {Message} message The user's discord.js Message
 * @param {String} footerText The text on the bottom line of the page
 * @param {Client} bot The bot
 */
export async function paginate(
	list: string[],
	page: number,
	headerText: string,
	ctx: MessageContext,
	footerText: string
) {
	const maxPage = Math.ceil(list.length / 15);
	if (page < 1) {
		page = 1;
	} else if (page > maxPage) {
		page = maxPage;
	}
	let header = `#=====[ ${headerText} (page ${page}/${maxPage}) ]=====#`;
	let body = list.slice(page * 15 - 15, page * 15).join("\n");
	let footer = `#${"".padEnd(Math.floor(header.length / 2 - footerText.length / 2) - 1, "=")}${footerText}${"".padEnd(Math.ceil(header.length / 2 - footerText.length / 2) - 1, "=")}#`;

	const msg = await ctx.reply(`\`\`\`md\n${header}\n${body}\n${footer}\`\`\``);
	if (maxPage > 1) {
		const hasRemovePerms = ctx.message.guild
			? ctx.channel.permissionsFor(ctx.client.user)!.has("MANAGE_MESSAGES")
			: true;
		const reactions = ["⬅", "❌", "➡"].filter(r => hasRemovePerms || r !== "❌");
		for (const react of reactions) {
			// eslint-disable-next-line no-await-in-loop
			await msg.react(react);
		}
		while (true) {
			// eslint-disable-next-line no-await-in-loop
			const collect = await msg.awaitReactions({
				filter: (reaction: MessageReaction, user: User) => user.id
					=== ctx.message.author.id
					&& reactions.includes(reaction.emoji.name!),
				time: 60000,
				max: 1
			}).catch(console.error) as Collection<string, MessageReaction>;

			if (collect.size) {
				const reaction = collect.first()!;
				const emoji = reaction.emoji.name;
				const prevPage = page;
				if (emoji === "⬅" && page > 1) page--;
				else if (emoji === "➡" && page < maxPage) page++;

				if (emoji !== "❌" && hasRemovePerms) {
					reaction.users.remove(ctx.message.author);
				}

				if (prevPage !== page) {
					header = `#=====[ ${headerText} (page ${page}/${maxPage}) ]=====#`;
					body = list.slice(page * 15 - 15, page * 15).join("\n");
					footer = `#${"".padEnd(Math.floor(header.length / 2 - footerText.length / 2) - 1, "=")}${footerText}${"".padEnd(Math.ceil(header.length / 2 - footerText.length / 2) - 1, "=")}#`;
					// eslint-disable-next-line no-await-in-loop
					await msg.edit(`\`\`\`md\n${header}\n${body}\n${footer}\`\`\``);
				}
			}
			if ((!collect.size || collect.first()!.emoji.name === "❌") && hasRemovePerms) {
				msg.reactions.removeAll();
				break;
			}
		}
	}
}

export function timeSince(timestamp: number) {
	let ellapsed = Date.now() - timestamp;
	const years = Math.floor(ellapsed / (365 * 24 * 60 * 60 * 1000));
	ellapsed -= years * (365 * 24 * 60 * 60 * 1000);
	const days = Math.floor(ellapsed / (24 * 60 * 60 * 1000));
	ellapsed -= days * (24 * 60 * 60 * 1000);
	const hours = Math.floor(ellapsed / (60 * 60 * 1000));
	ellapsed -= hours * (60 * 60 * 1000);
	const minutes = Math.floor(ellapsed / (60 * 1000));

	let str = "";
	let units = 0; // The number of units the time is measured in; max of 2
	if (years) {
		str += `${years} year${years > 1 ? "s" : ""}`;
		units++;
	}
	if (!units && days || units) {
		str += `${str ? " and " : ""}${days} day${days !== 1 ? "s" : ""}`;
		units++;
	}
	if (!units && hours || units === 1) {
		str += `${str ? " and " : ""}${hours} hour${hours !== 1 ? "s" : ""}`;
		units++;
	}
	if (!units && minutes || units === 1) {
		str += `${str ? " and " : ""}${minutes} minute${minutes !== 1 ? "s" : ""}`;
	}
	if (!str) str = "now";

	return str;
}

export const timezoneSupport = (value: string) => {
	if (/((UTC)|(GMT))(\+|-)\d{1,2}/i.test(value)) {
		return true;
	} if (timeNames.indexOf(value) !== -1) {
		return true;
	} return false;
};
