const { Command, Embed } = require("./GeneralCategory");

module.exports.Command = class OsuCommand extends Command {
	constructor(...args) {
		super(...args);
		this.category = "Image";
		this.color = "#a0522d";
	}
};

module.exports.Embed = Embed;
