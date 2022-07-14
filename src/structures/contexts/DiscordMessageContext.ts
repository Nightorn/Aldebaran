import { GuildMember, Message, MessageEmbed, MessageOptions, TextChannel } from "discord.js";
import DiscordContext from "./DiscordContext.js";
import Server from "../models/DiscordServer.js";
import User from "../models/DiscordUser.js";
import { parseArgs, parseInput } from "../../utils/Args.js";
import DiscordClient from "../DiscordClient.js";
import Command from "../../groups/Command.js";
import { If } from "../../utils/Constants.js";

export default class DiscordMessageContext
	<InGuild extends boolean = false> extends DiscordContext<InGuild>
{
	private _splitArgs: string[];
	private message: Message;
	public command?: Command;

	constructor(
		author: User,
		client: DiscordClient,
		message: Message,
		server: If<InGuild, Server>
	) {
		super(author, client, server);
		this.message = message;

		const parsedInput = parseInput(
			this.client,
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

	get member() {
		return this.message.member as If<InGuild, GuildMember>;
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
		return this.server?.base.prefix || "";
	}

	async delete(delay?: number): Promise<Message<boolean> | false> {
		const hasPermission = this.server && (this.channel as TextChannel)
			.permissionsFor(this.client.discord.user.id)?.has("MANAGE_MESSAGES");

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
