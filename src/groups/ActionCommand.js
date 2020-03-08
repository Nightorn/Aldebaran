const { Command, Embed } = require("./Command");

module.exports.Command = class ActionCommand extends Command {
	constructor(client, metadata) {
		super(client, {
			...metadata,
			args: { user: { as: "user" } }
		});
		this.category = "Action";
		this.color = "AQUA";
	}
};

module.exports.Embed = Embed;
