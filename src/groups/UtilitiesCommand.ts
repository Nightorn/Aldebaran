import { CommandMetadata } from "../interfaces/Command.js";
import Client from "../structures/Client.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(client: Client, metadata: CommandMetadata) {
		super(client, metadata);
		this.category = "Utilities";
		this.color = "#e9724c";
	}
}
