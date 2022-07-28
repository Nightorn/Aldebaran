import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";
import Client from "../structures/Client.js";
import { CommandMode, Platform } from "./Constants";

const userRegex = /\d{17,19}|[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}/;

type DefaultArg = {
	desc: string,
	optional?: boolean
};

type Flag = {
	long: string,
	short: string
};

export type BooleanArg = DefaultArg & {
	as: "boolean",
	flag: Flag
};

export type ExpressionArg = DefaultArg & {
	as: "expression",
	regex: RegExp
};

export type ModeArg = DefaultArg & {
	as: "mode",
	choices: APIApplicationCommandOptionChoice<string>[]
	flag?: Flag
};

export type NumberArg = DefaultArg & { as: "number" };
export type StringArg = DefaultArg & { as: "string" };
export type UserArg = DefaultArg & { as: "user" };

export type Arg = BooleanArg
	| ExpressionArg
	| ModeArg
	| NumberArg
	| StringArg
	| UserArg;

export type Args = { [key: string]: Arg };

export function checkArgType(element: string) {
	if (element.match(userRegex)) return "user";
	if (element.match(/([-]{1,2}[\w]+)/g)) return "flag";
	if (!Number.isNaN(Number(element))) return "number";
	return "string";
}

type Deconstructed = (
	{ user: string }
	| { string: string }
	| { number: number }
	| { flag: { id: string, pv: string } }
)[];

export function parseArgs(split: string[], argsMetadata: Args) {
	if (Object.keys(argsMetadata).length === 1
		&& Object.values(argsMetadata)[0].as === "string") {
		return { [Object.keys(argsMetadata)[0]]: split.join(" ") };
	}

	const deconstructed: Deconstructed = []; // All arguments and their type
	for (let i = 0; i < split.length; i++) {
		// if the argument is between double quotes, then concatenate what needs to be concatenated
		if (split[i].startsWith("\"")) {
			let chain = `${split[i].slice(1)} `;
			i++;
			while (chain) {
				if (split[i].includes("\"")) {
					chain += split[i].substr(0, split[i].indexOf("\""));
					deconstructed.push({ string: chain });
					chain = "";

					// if the user forgot a space like in `&plantcalc "Olive Seed"2 25`, don't forget 2
					const rest = split[i].substr(split[i].indexOf("\""));
					if (rest) {
						split[i] = rest;
					}
				} else {
					i++;
					chain += `${split[i]} `;
				}
			}
		}
		const type = checkArgType(split[i]);
		if (type === "user") {
			const match = split[i].match(userRegex);
			if (match) {
				deconstructed.push({ user: match[0] });
			}
		} else if (type === "number") {
			deconstructed.push({ number: Number(split[i]) });
		} else if (type === "flag") {
			deconstructed.push({
				flag: {
					id: split[i].replace(/-/g, ""),
					pv: split[i + 1]
				}
			});
		} else if (type === "string") {
			deconstructed.push({ string: split[i] });
		}
	}
	const args: { [key: string]: string | boolean } = { };
	for (const element of deconstructed) {
		const [[type, value]] = Object.entries(element);
		let result = null;
		for (const [arg, data] of Object.entries(argsMetadata)) {
			if (result) break;
			if (args[arg] === undefined) {
				if (data.as === type && !(data.as === "mode" || data.as === "boolean")) {
					result = { arg, value };
				} else if (type === "flag" && (data.as === "mode" || data.as === "boolean") && data.flag) {
					if ([data.flag.short, data.flag.long].includes(value.id)) {
						if (data.as === "boolean") {
							result = { arg, value: true };
						}
					}
				} else if (type === "flag" && data.as === "mode") {
					result = { arg, value: value.id };
				} else if (type !== "flag" && data.as === "expression") {
					const match = String(value).match(data.regex);
					if (match) {
						result = { arg, value: match[0] };
					}
				}
			}
		}
		if (result) {
			args[result.arg] = result.value;
		}
	}
	return args;
}

/**
 * Parses the message content into the requested command and its arguments.
 */
export function parseInput(
	client: Client,
	content: string,
	mode: CommandMode,
	prefix: string,
	platform: Platform
) {
	const split = content.slice(prefix.length + +(mode !== "NORMAL")).split(" ");
	let command = client.commands.get(split.shift() || "", platform);

	while (command && command.subcommands.get(split[0])) {
		command = command.subcommands.get(split.shift() || "");
	}

	return { command, args: split };
}
