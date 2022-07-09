import { CommandMetadata } from "../interfaces/Command.js";
import Client from "../structures/Client.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(client: Client, metadata: CommandMetadata) {
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
}
