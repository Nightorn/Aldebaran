import { Command as C, Embed as E } from "./Command.js";

export const Command = class OsuCommand extends C {
	constructor(...args) {
		super(...args);
		this.category = "Image";
		this.color = "#a0522d";
	}
};

export const Embed = E;
