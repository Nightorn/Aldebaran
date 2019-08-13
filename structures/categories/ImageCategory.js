const { MessageEmbed } = require("discord.js");
const { Command } = require("./GeneralCategory");

module.exports.Command = class OsuCommand extends Command {
	constructor(...args) {
		super(...args);
		this.category = "Image";
		this.color = "#a0522d";
	}
};

module.exports.Embed = class Embed extends MessageEmbed {
	constructor(command) {
		super();
		this.setColor(command.color);
	}
};
