import { CommandMetadata } from "../interfaces/Command.js";
import AldebaranClient from "../structures/djs/Client.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(client: AldebaranClient, metadata: CommandMetadata) {
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
};
