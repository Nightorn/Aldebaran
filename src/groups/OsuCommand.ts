import { CommandMetadata } from "../interfaces/Command.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(metadata: CommandMetadata) {
		super({
			cooldown: {
				group: "osu",
				amount: 60,
				resetInterval: 60000
			},
			...metadata
		});
		this.category = "osu!";
		this.color = "#ff66aa";
	}
}
