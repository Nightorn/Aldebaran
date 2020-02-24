const { Command } = require("./Command");

module.exports.Command = class DeveloperCategory extends Command {
	constructor(client, metadata) {
		super(client, {
			...metadata,
			perms: metadata.perms === undefined
				? { aldebaran: ["DEVELOPER"] }
				: { ...metadata.perms }
		});
		this.category = "Developer";
	}
};
