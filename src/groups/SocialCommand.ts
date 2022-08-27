import { CommandMetadata } from "../interfaces/Command.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(metadata: CommandMetadata) {
		super({
			args: { user: {
				as: "user",
				desc: "The user you want to annoy with random memes"
			} },
			...metadata
		});
		this.category = "Action";
		this.color = "Aqua";
	}
}
