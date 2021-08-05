import { readFileSync } from "fs";
import moment from "moment-timezone";

const timeNames = moment.tz.names();

export const escape = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

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

export const importAssets = (path: string) => {
	return JSON.parse(readFileSync(path).toString());
};

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

export const timezoneSupport = (value: string) => {
	if (/((UTC)|(GMT))(\+|-)\d{1,2}/i.test(value)) {
		return true;
	} if (timeNames.indexOf(value) !== -1) {
		return true;
	} return false;
};
