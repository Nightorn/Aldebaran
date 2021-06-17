import { Command as C, Embed as E } from "./Command.js";

export const Command = class ActionCommand extends C {
	constructor(client, metadata) {
		super(client, {
			args: { user: { as: "user" } },
			...metadata
		});
		this.category = "Action";
		this.color = "AQUA";
	}
};

export const Embed = E;
