const { Command, Embed } = require("./GeneralCategory");

module.exports.Command = class DRPGCommand extends Command {
	constructor(...args) {
		super(...args);
		this.category = "DiscordRPG";
		this.color = "GREEN";
	}
};

module.exports.Embed = Embed;
