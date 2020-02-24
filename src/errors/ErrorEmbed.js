const { MessageEmbed } = require("discord.js");

module.exports = class ErrorEmbed extends MessageEmbed {
	constructor(message) {
		super();
		this.setColor("RED");
		this.setAuthor("Generic Error Embed");
		this.setDescription("Please inform a developer if you see this message.");
		this.setFooter(message.author.username, message.author.avatarURL());
	}
};
