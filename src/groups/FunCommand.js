import { Command as C, Embed as E } from "./Command.js";

export const Command = class FunCommand extends C {
	constructor(...args) {
		super(...args);
		this.category = "Fun";
		this.color = "PURPLE";
	}
};

export const Embed = E;
