import { CommandMetadata } from "../interfaces/Command.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(metadata: CommandMetadata) {
		super({
			perms: metadata.perms === undefined
				? { aldebaran: ["ADMINISTRATOR"] }
				: { ...metadata.perms },
			...metadata
		});
		this.category = "Developer";
		this.color = "#e74c3c";
	}
}
