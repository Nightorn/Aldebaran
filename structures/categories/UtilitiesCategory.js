const { Command, Embed } = require("./GeneralCategory");

module.exports.Command = class UtilitiesCategory extends Command {
	constructor(client, metadata) {
		super(client, metadata);
		this.category = "Utilities";
		this.color = "#e9724c";
	}
};

module.exports.Embed = Embed;
