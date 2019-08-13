const { Command } = require("./GeneralCategory");

module.exports.Command = class NSFWCategory extends Command {
	constructor(client, metadata) {
		super(client, metadata);
		this.category = "Utilities";
	}
};
