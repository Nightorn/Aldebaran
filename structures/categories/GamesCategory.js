const { Command, Embed } = require("./GeneralCategory");

module.exports.Command = class GamesCommand extends Command {
	constructor(...args) {
		super(...args);
		this.category = "Games";
		this.color = "PURPLE";
	}
};

module.exports.Embed = Embed;
