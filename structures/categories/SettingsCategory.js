const { Command, Embed } = require("./GeneralCategory");

module.exports.Command = class SettingsCategory extends Command {
	constructor(client, metadata) {
		super(client, metadata);
		this.category = "Settings";
	}
};

module.exports.Embed = Embed;
