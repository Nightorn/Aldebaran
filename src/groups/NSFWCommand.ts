import { TextChannel, ThreadChannel } from "discord.js";
import { CommandMetadata } from "../interfaces/Command.js";
import MessageContext from "../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../structures/djs/Client.js";
import { Command as C, Embed as E } from "./Command.js";

export abstract class Command extends C {
	constructor(client: AldebaranClient, metadata: CommandMetadata) {
		super(client, metadata);
		this.category = "NSFW";
		this.color = "#ff66aa";
		this.hidden = true;
	}

	async execute(ctx: MessageContext) {
		if ((ctx.channel instanceof TextChannel && !ctx.channel.nsfw)
			|| (ctx.channel instanceof ThreadChannel && !ctx.channel.parent!.nsfw)
		) {
			throw new Error("NOT_NSFW_CHANNEL");
		}
		super.execute(ctx);
	}
};

export const Embed = E;
