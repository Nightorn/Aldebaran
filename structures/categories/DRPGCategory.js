const { Command } = require("./GeneralCategory");

module.exports.Command = class DRPGCommand extends Command {
	constructor(...args) {
		super(...args);
		this.category = "DiscordRPG";
		this.color = "GREEN";
	}
};
