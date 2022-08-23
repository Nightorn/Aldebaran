import { TextChannel, ThreadChannel } from "discord.js";
import { CommandMetadata } from "../interfaces/Command.js";
import MessageContext from "../structures/contexts/MessageContext.js";
import { Platform } from "../utils/Constants.js";
import C from "./Command.js";

export default abstract class Command extends C {
	constructor(metadata: CommandMetadata) {
		super(metadata);
		this.category = "NSFW";
		this.color = "#ff66aa";
		this.hidden = true;
	}

	async execute(ctx: MessageContext, platform: Platform) {
		if ((ctx.channel instanceof TextChannel && !ctx.channel.nsfw)
			|| (ctx.channel instanceof ThreadChannel && !ctx.channel.parent?.nsfw)
		) {
			throw new Error("NOT_NSFW_CHANNEL");
		}
		super.execute(ctx, platform);
	}
}
