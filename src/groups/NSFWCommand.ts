import CommandMetadata from "../interfaces/CommandMetadata.js";
import AldebaranClient from "../structures/djs/Client.js";
import Message from "../structures/djs/Message.js";
import { Command as C, Embed as E } from "./Command.js";

export abstract class Command extends C {
	constructor(client: AldebaranClient, metadata: CommandMetadata) {
		super(client, metadata);
		this.category = "NSFW";
		this.color = "#ff66aa";
		this.hidden = true;
	}

	execute(message: Message) {
		if (!message.channel.nsfw) throw new Error("NOT_NSFW_CHANNEL");
		super.execute(message);
	}
};

export const Embed = E;
