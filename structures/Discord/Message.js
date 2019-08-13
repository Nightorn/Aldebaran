const { Collection } = require("discord.js");

module.exports = BaseMessage => class Message extends BaseMessage {
	constructor(client, data, channel) {
		super(client, data, channel);
		if (this.channel.guild) {
			this.prefix = this.content.slice(0, this.channel.guild.prefix.length);
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

	get mode() {
		if (this.content.indexOf(`${this.prefix}#`)) return "ADMIN";
		if (this.content.indexOf(`${this.prefix}?`)) return "HELP";
		return "NORMAL";
	}

	get command() {
		return this.content
			.slice(this.prefix.length + this.mode !== "NORMAL")
			.split(" ")[0];
	}
};
