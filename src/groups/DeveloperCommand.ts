import CommandMetadata from "../interfaces/CommandMetadata.js";
import AldebaranClient from "../structures/djs/Client.js";
import { Command as C } from "./Command.js";

export abstract class Command extends C {
	constructor(client: AldebaranClient, metadata: CommandMetadata) {
		super(client, {
			perms: metadata.perms === undefined
				? { aldebaran: ["ADMINISTRATOR"] }
				: { ...metadata.perms },
			...metadata
		});
		this.category = "Developer";
	}
};
