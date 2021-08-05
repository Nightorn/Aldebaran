import CommandMetadata from "../interfaces/CommandMetadata.js";
import AldebaranClient from "../structures/djs/Client.js";
import { Command as C, Embed as E } from "./Command.js";

export abstract class Command extends C {
	constructor(client: AldebaranClient, metadata: CommandMetadata) {
		super(client, metadata);
		this.category = "Image";
		this.color = "#a0522d";
	}
};

export const Embed = E;
