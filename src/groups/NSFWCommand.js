import { Command as C, Embed as E } from "./Command.js";

export const Command = class NSFWCategory extends C {
	constructor(client, metadata) {
		super(client, metadata);
		this.category = "NSFW";
		this.color = "#ff66aa";
		this.hidden = true;
	}

	execute(message) {
		if (!message.channel.nsfw) throw new Error("NOT_NSFW_CHANNEL");
		super.execute(message);
	}
};

export const Embed = E;
