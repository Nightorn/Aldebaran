import { CommandMetadata } from "../interfaces/Command.js";
import Client from "../structures/Client.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(client: Client, metadata: CommandMetadata) {
		super(client, {
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
