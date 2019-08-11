const { Command, Embed } = require("./GeneralCategory");

module.exports.Command = class FunCommand extends Command {
	constructor(...args) {
		super(...args);
		this.category = "Games";
		this.color = "PURPLE";
	}
};

module.exports.Embed = Embed;
