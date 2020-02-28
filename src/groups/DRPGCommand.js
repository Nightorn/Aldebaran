const { Command, Embed } = require("./Command");

module.exports.Command = class DRPGCommand extends Command {
	constructor(...args) {
		super(...args);
		this.category = "DiscordRPG";
		this.color = "GREEN";
	}
};

module.exports.Embed = Embed;
