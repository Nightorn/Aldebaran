const { Collection } = require("discord.js");

module.exports = BaseMessage => class Message extends BaseMessage {
	constructor(client, data, channel) {
		super(client, data, channel);
		if (this.channel.guild) {
			this.prefix = this.content.slice(0, this.guild.prefix.length);
			this.valid = this.content.indexOf(this.prefix) === 0;
		}
	}

	get userMentions() {
		if (this.guild === null) return new Collection();
		if (this.guild.members === undefined) return new Collection();
		return new Collection(
			this.guild.members.entries()
		).filter(member => {
			const results = this.content.match(/(<@)([0-9]{16,19})>/g);
			return results !== null ? results.includes(`<@${member.id}>`) : false;
		});
	}

	get args() {
		const args = this.content
			.slice(this.prefix.length + this.command.length)
			.split(" ");
		args.shift();
		return args;
	}

	// eslint-disable-next-line class-methods-use-this
	getArgs(required) {
		if (required !== undefined) {
			const split = this.args;
			const checkType = element => {
				if (element.match(/\d{17,19}/g)) return "user";
				if (element.match(/([-]{1,2}[\w]+)/g)) return "flag";
				if (!Number.isNaN(Number(element))) return "number";
				return "word";
			};
			const deconstructed = [];
			for (let i = 0; i < split.length; i++) {
				const type = checkType(split[i]);
				if (type === "user")
					deconstructed.push({ user: split[i].match(/\d{17,19}/g)[0] });
				else if (type === "number") deconstructed.push({ number: Number(split[i]) });
				else if (type === "flag") {
					deconstructed.push({
						flag: {
							id: split[i].replace(/-/g, ""),
							pv: split[i + 1]
						}
					});
				} else if (type === "word") deconstructed.push({ word: split[i] });
			}
			const args = {};
			for (const element of deconstructed) {
				const [[type, value]] = Object.entries(element);
				let result = null;
				for (const [arg, data] of Object.entries(required)) {
					const as = data.as.replace("?", "");
					if (result !== null) break;
					if (args[arg] === undefined) {
						if (as === type && data.flag === undefined) {
							result = { arg, value };
						} else if (type === "flag" && data.flag !== undefined) {
							if ([data.flag.short, data.flag.long].includes(value.id)) {
								if (as === "boolean") {
									result = { arg, value: true };
								} else if (value.pv !== undefined) {
									if (checkType(value.pv) === as)
										result = { arg, value: value.pv };
								}
							}
						} else if (type === "flag" && as === "mode") {
							result = { arg, value: value.id };
						} else if (type !== "flag" && as === "expression") {
							const match = String(value).match(data.regex);
							if (match) result = { arg, value: match[0] };
						}
					}
				}
				if (result !== null) args[result.arg] = result.value;
			}
			return args;
		}
		return this.args;
	}

	get mode() {
		if (this.content.indexOf(`${this.prefix}#`) === 0) return "ADMIN";
		if (this.content.indexOf(`${this.prefix}?`) === 0) return "HELP";
		if (this.content.indexOf(`${this.prefix}-`) === 0) return "IMAGE";
		return "NORMAL";
	}

	get command() {
		return this.content
			.slice(this.prefix.length + this.mode !== "NORMAL")
			.split(" ")[0];
	}
};
