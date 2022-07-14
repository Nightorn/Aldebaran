import { CommandMetadata } from "../interfaces/Command.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(metadata: CommandMetadata) {
		super(metadata);
		this.category = "DiscordRPG";
		this.color = "GREEN";
	}
}
