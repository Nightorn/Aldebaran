import { CommandMetadata } from "../interfaces/Command.js";
import AldebaranClient from "../structures/djs/Client.js";
import { Command as C, Embed as E } from "./Command.js";

export abstract class Command extends C {
	constructor(client: AldebaranClient, metadata: CommandMetadata) {
		super(client, {
			args: { user: {
				as: "user",
				desc: "The user you want to annoy with random memes"
			} },
			...metadata
		});
		this.category = "Action";
		this.color = "AQUA";
	}
};

export const Embed = E;
