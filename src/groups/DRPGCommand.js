import { Command as C, Embed as E } from "./Command.js";

export const Command = class DRPGCommand extends C {
	constructor(...args) {
		super(...args);
		this.category = "DiscordRPG";
		this.color = "GREEN";
	}
};

export const Embed = E;
