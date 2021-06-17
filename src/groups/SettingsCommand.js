import { Command as C, Embed as E } from "./Command.js";

export const Command = class SettingsCategory extends C {
	constructor(client, metadata) {
		super(client, metadata);
		this.category = "Settings";
	}
};

export const Embed = E;
