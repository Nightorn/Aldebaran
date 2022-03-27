import { CommandMetadata } from "../interfaces/Command.js";
import AldebaranClient from "../structures/djs/Client.js";
import { Command as C, Embed as E } from "./Command.js";

export abstract class Command extends C {
	constructor(client: AldebaranClient, metadata: CommandMetadata) {
		super(client, {
			perms: metadata.perms === undefined
				? { aldebaran: ["ADMINISTRATOR"] }
				: { ...metadata.perms },
			...metadata
		});
		this.category = "Developer";
		this.color = "#e74c3c";
	}
};

export const Embed = E;
