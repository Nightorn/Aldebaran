const { Command, Embed } = require("./Command");

module.exports.Command = class ActionCommand extends Command {
	constructor(...args) {
		super(...args);
		this.category = "Action";
		this.color = "AQUA";
	}
};

module.exports.Embed = Embed;
