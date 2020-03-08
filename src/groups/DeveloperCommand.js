const { Command } = require("./Command");

module.exports.Command = class DeveloperCategory extends Command {
	constructor(client, metadata) {
		super(client, {
			...metadata,
			perms: metadata.perms === undefined
				? { aldebaran: ["ADMINISTRATOR"] }
				: { ...metadata.perms }
		});
		this.category = "Developer";
	}
};
