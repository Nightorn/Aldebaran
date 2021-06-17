import { Command as C, Embed as E } from "./Command.js";

export const Command = class UtilitiesCategory extends C {
	constructor(client, metadata) {
		super(client, metadata);
		this.category = "Utilities";
		this.color = "#e9724c";
	}
};

export const Embed = E;
