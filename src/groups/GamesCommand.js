import { Command as C, Embed as E } from "./Command.js";

export const Command = class GamesCommand extends C {
	constructor(...args) {
		super(...args);
		this.category = "Games";
		this.color = "PURPLE";
	}
};

export const Embed = E;
