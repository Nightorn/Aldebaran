import { Message, MessageEmbed, MessageOptions, TextChannel } from "discord.js";
import MessageContext from "./MessageContext.js";
import Guild from "../djs/Guild.js";
import User from "../djs/User.js";
import { parseArgs, parseInput } from "../../utils/Args.js";
import Client from "../djs/Client.js";
import Command from "../../groups/Command.js";

export default class DiscordMessageContext extends MessageContext {
	private _splitArgs: string[];
	public command?: Command;

	constructor(
		public client: Client, 
		private message: Message, 
		public author: User, 
		public guild?: Guild,
		public interactionUser?: User
	) {
		super(client);

		const parsedInput = parseInput(
			client,
			this.content,
			this.mode,
			this.prefix,
			"DISCORD"
		);
		this.command = parsedInput.command;
		this._splitArgs = parsedInput.args;
	}

	get args() {
		if (!this._args) {
			const meta = this.command?.metadata.args;
			this._args = meta ? parseArgs(this._splitArgs, meta) : this._splitArgs;
		}
		return this._args;
	}

	get channel() {
		return this.message.channel;
	}

	get content() {
		return this.message.content;
	}

	get createdTimestamp() {
		return this.message.createdTimestamp;
	}

	get embeds() {
		return this.message.embeds;
	}

	get interaction() {
		return this.message.interaction;
	}

	get member() {
		return this.message.member;
	}

	get mentions() {
		return this.message.mentions;
	}

	get mode() {
		if (this.message.content.indexOf(`${this.prefix}#`) === 0) return "ADMIN";
		if (this.message.content.indexOf(`${this.prefix}?`) === 0) return "HELP";
		if (this.message.content.indexOf(`${this.prefix}-`) === 0) return "IMAGE";
		return "NORMAL";
	}

	get prefix() {
		return this.guild?.prefix ?? "";
	}

	async delete(delay?: number): Promise<Message<boolean> | false> {
		const hasPermission = this.guild && (this.channel as TextChannel)
			.permissionsFor(this.client.user.id)?.has("MANAGE_MESSAGES");

		if (hasPermission) {
			if (delay) {
				return new Promise(resolve => {
					setTimeout(() => {
						resolve(this.message.delete());
					}, delay);
				});
			}
			return this.message.delete();
		}
		return false;
	}

	async reply(content: string | MessageOptions | MessageEmbed) {
		return content instanceof MessageEmbed
			? this.message.channel.send({ embeds: [content] })
			: this.message.channel.send(content);
	}
}
