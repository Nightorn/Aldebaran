import { Command as C, Embed as E } from "./Command.js";

export const Command = class OsuCategory extends C {
	constructor(client, metadata) {
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

	registerCheck() {
		return process.env.API_OSU !== undefined && process.env.API_OSU !== null;
	}
};

export const Embed = E;
