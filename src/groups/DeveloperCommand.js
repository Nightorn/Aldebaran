const { Command } = require("./Command");

module.exports.Command = class DeveloperCategory extends Command {
	constructor(client, metadata) {
		super(client, {
			perms: metadata.perms === undefined
				? { aldebaran: ["ADMINISTRATOR"] }
				: { ...metadata.perms },
			...metadata
		});
		this.category = "Developer";
	}
};
