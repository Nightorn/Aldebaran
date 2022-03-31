import { CommandMetadata } from "../interfaces/Command.js";
import AldebaranClient from "../structures/djs/Client.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(client: AldebaranClient, metadata: CommandMetadata) {
		super(client, metadata);
		this.category = "Fun";
		this.color = "PURPLE";
	}
}
