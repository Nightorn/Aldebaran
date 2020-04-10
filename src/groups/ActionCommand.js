const { Command, Embed } = require("./Command");

module.exports.Command = class ActionCommand extends Command {
	constructor(client, metadata) {
		super(client, {
			args: { user: { as: "user" } },
			...metadata
		});
		this.category = "Action";
		this.color = "AQUA";
	}
};

module.exports.Embed = Embed;
