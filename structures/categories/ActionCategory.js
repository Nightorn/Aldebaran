const { Command } = require("./GeneralCategory");

module.exports.Command = class FunCommand extends Command {
	constructor(...args) {
		super(...args);
		this.category = "Action";
		this.color = "AQUA";
	}
};
