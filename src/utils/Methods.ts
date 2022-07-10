import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import moment from "moment-timezone";
import DatabaseProvider from "../handlers/DatabaseProvider.js";
import Setting from "../interfaces/Setting.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../structures/contexts/DiscordSlashMessageContext.js";

const timeNames = moment.tz.names();

export async function createNekosEmbed(description: string, endpoint: Function) {
    return new MessageEmbed()
        .setDescription(description)
        .setFooter({
            text: "Powered by nekos.life",
            iconURL: "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4"
        })
        .setImage((await endpoint()).url);
}

export async function deduplicateSettings<T extends Setting>(
    settings: T[] = []
) {
    const originals: T[] = [];
    const toDeletion: Promise<void>[] = [];
    for (const setting of settings) {
        if (originals.some(s => s.key === setting.key)) {
            toDeletion.push(setting.destroy());
        } else {
            originals.push(setting);
        }
    }
    await Promise.all(toDeletion);
    return originals;
}

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
 * Paginates an embed with arrow buttons, editing the title and description properties with the page number and content.
 * @param {Array<String>} list Array of rows to be displayed
 * @param {Number} pageSize Number of rows to be displayed per page
 * @param {String} headerText Title of the embed
 * @param {Message} message The discord.js Message that triggered the command
 * @param {MessageEmbed} embed A Discord.js MessageEmbed with extra properties defined
 */
export async function paginate(
	list: string[],
	pageSize: number,
	headerText: string,
	ctx: DiscordMessageContext | DiscordSlashMessageContext,
	codeblock?: string,
	embed: MessageEmbed = new MessageEmbed()
) {
	const emojiButton = (emoji: string) => new MessageButton()
		.setEmoji(emoji)
		.setStyle("SECONDARY")
		.setCustomId(emoji);
	const [leftButton, xButton, rightButton] = ["⬅️", "❌", "➡️"].map(emojiButton);
	const buttonRow = new MessageActionRow();
	const maxPage = Math.ceil(list.length / pageSize);
	let page = 1;

	function updateEmbed() {
		embed.title = `${headerText} (page ${page}/${maxPage})`;
		const description = list
			.slice((page - 1) * pageSize, page * pageSize)
			.join("\n")
			.trim() || "Err";
		embed.description = codeblock
			? `\`\`\`${codeblock}\n${description}\n\`\`\``
			: description;
		leftButton.setDisabled(page === 1);
		rightButton.setDisabled(page === maxPage);
		buttonRow.setComponents([leftButton, xButton, rightButton]);
	}
	updateEmbed();

	const opt = { embeds: [embed], components: maxPage > 1 ? [buttonRow] : [] };
	const reply = ctx instanceof DiscordSlashMessageContext
		? await ctx.reply(opt, false, true)
		: await ctx.reply(opt);

	// Keep collecting interactions as long as there's pages to paginate.
	while (maxPage > 1) {
		const interaction = await reply.awaitMessageComponent({
			filter: i => i.user.id === ctx.author.id ? true : !i.deferUpdate(),
			time: 60000
		}).catch(() => {});

		if (!interaction || interaction.customId === "❌") {
			reply.edit({ components: [] });
			break;
		}

		if (interaction.customId === "⬅️") page--;
		if (interaction.customId === "➡️") page++;
		updateEmbed();
		await interaction.update({ embeds: [embed], components: [buttonRow] });
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

export function tableConf(modelName: string) {
	return { modelName, sequelize: DatabaseProvider.getInstance() };
}

// https://github.com/tindoductran/zodiac/blob/master/getZodiac2.html
const zodBounds = [20, 19, 20, 20, 20, 21, 22, 22, 21, 22, 21, 21];
const zodMonths = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus",
    "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
export function zodiacName(date: Date) {
	const monthIndex = date.getMonth() - 1;
    const signMonthIndex = date.getDate() <= zodBounds[monthIndex]
        ? monthIndex
        : (monthIndex + 1) % 12
	return zodMonths[signMonthIndex];
}
