import { Command as C } from "./Command.js";

export const Command = class DeveloperCategory extends C {
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
