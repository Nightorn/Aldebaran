import { Message as DMessage, MessageEmbed as MEmbed, MessageOptions as MOptions, MessagePayload as MPayload, TextChannel, ThreadChannel } from "discord.js";
import { ErrorString, Errors } from "../../utils/Constants.js";
import { Args } from "../../interfaces/Arg.js";
import Client from "../djs/Client.js";
import Guild from "../djs/Guild.js";
import User from "../djs/User.js";

const checkType = (element: string) => {
	if (element.match(/\d{17,19}/g)) return "user";
	if (element.match(/([-]{1,2}[\w]+)/g)) return "flag";
	if (!Number.isNaN(Number(element))) return "number";
	return "word";
};

export default class MessageContext {
	private _argsMetadata?: Args;
	private _author?: User;
	private _guild?: Guild;
	private _args?: string[] | { [key: string]: string | boolean; };
	client: Client;
	level: number = 0; // 0 if command, 1 if subcommand, 2 if subsubcommand, etc.
	message: DMessage;
	prefix: string;

	constructor(client: Client, message: DMessage, prefix: string, args?: Args) {
		this._argsMetadata = args;
		this.client = client;
		this.message = message;
		this.prefix = prefix;
	}

	get args() {
		if (!this._args) {
			this._args = this.getArgs();
		}
		return this._args;
	}
	
	argsCheck() {
		if (this._argsMetadata) {
			const mandatory = Object.keys(this._argsMetadata)
				.filter(k => !this._argsMetadata![k].optional);
			const mandatoryFound = Object.keys(this.args).filter(k => mandatory.includes(k));
			return mandatory.length === mandatoryFound.length;
		}
		return true;
	}

	async author() {
		if (!this._author) {
			this._author = await this.client.customUsers
				.fetch(this.message.author.id);
		}
		return this._author;
	}

	get command() {
		return this.message.content
			.slice(this.prefix.length + +(this.mode !== "NORMAL"))
			.split(" ")[0];
	}

	async guild() {
		if (this.message.guild) {
			if (!this._guild) {
				this._guild = await this.client.customGuilds
					.fetch(this.message.guild.id);
			}
			return this._guild;
		}
		return null;
	}

	// the shift parameter should be 1 when a subcommand is used, 2 when a subsubcommand is used (which is sadly not supported), etc.
	getSplitArgs() {
		const split = this.message.content
			.slice(this.prefix.length + this.command.length)
			.split(" ");
		for (let i = 0; i < this.level + 1; i++) {
			split.shift();
		}
		return split;
	}

	getArgs() {
		const split = this.getSplitArgs();
		if (this._argsMetadata) {
			const deconstructed = []; // All arguments and their type
			for (let i = 0; i < split.length; i++) {
				const type = checkType(split[i]);
				if (type === "user") {
					deconstructed.push({ user: split[i].match(/\d{17,19}/g)![0] });
				} else if (type === "number") {
					deconstructed.push({ number: Number(split[i]) });
				} else if (type === "flag") {
					deconstructed.push({
						flag: {
							id: split[i].replace(/-/g, ""),
							pv: split[i + 1]
						}
					});
				} else if (type === "word") {
					deconstructed.push({ word: split[i] });
				}
			}
			const args: { [key: string]: string | boolean } = { };
			for (const element of deconstructed) {
				const [[type, value]] = Object.entries(element);
				let result = null;
				for (const [arg, data] of Object.entries(this._argsMetadata)) {
					if (result) break;
					if (args[arg] === undefined) {
						if (data.as === type && data.flag === undefined) {
							result = { arg, value };
						} else if (type === "flag" && data.flag) {
							if ([data.flag.short, data.flag.long].includes(value.id)) {
								if (data.as === "boolean") {
									result = { arg, value: true };
								} else if (value.pv !== undefined) {
									if (checkType(value.pv) === data.as) {
										result = { arg, value: value.pv };
									}
								}
							}
						} else if (type === "flag" && data.as === "mode") {
							result = { arg, value: value.id };
						} else if (type !== "flag" && data.as === "expression") {
							const match = String(value).match(data.regex!);
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
		return split;
	}

	get mode() {
		if (this.message.content.indexOf(`${this.prefix}#`) === 0) return "ADMIN";
		if (this.message.content.indexOf(`${this.prefix}?`) === 0) return "HELP";
		if (this.message.content.indexOf(`${this.prefix}-`) === 0) return "IMAGE";
		return "NORMAL";
	}

	setLevel(level: number) {
		this.level = level;
		this._args = undefined;
	}

	async error(type: ErrorString, desc?: string, value?: string) {
		const title = Errors[type] !== undefined ? Errors[type](value!) : "An error has occured.";
		const embed = new MEmbed()
			.setTitle(title)
			.setColor("RED");
		if (type === "UNEXPECTED_BEHAVIOR") {
			embed.setDescription(`${desc}\nPlease contact the developers or fill a bug report with \`${this.prefix}bugreport\`.`);
		} else if (type === "INVALID_USER") {
			embed.setDescription("The user ID you have supplied is invalid, or the user you have mentionned does not exist. Make sure your user ID or your mention is correct.");
		} else if (desc) {
			embed.setDescription(desc);
		}
		return this.reply(embed);
	}

	async reply(content: string | MPayload | MOptions | MEmbed) {
		if (content instanceof MEmbed) {
			return this.message.channel.send({ embeds: [content] });
		}
		return this.message.channel.send(content);
	}

	get channel() {
		return this.message.channel as TextChannel | ThreadChannel;
	}
};
