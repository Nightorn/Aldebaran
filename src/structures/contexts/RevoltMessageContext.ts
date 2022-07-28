import { Channel, Member, Message } from "revolt.js";
import Command from "../../groups/Command.js";
import { parseArgs, parseInput } from "../../utils/Args.js";
import { If } from "../../utils/Constants.js";
import Embed from "../Embed.js";
import RevoltServer from "../models/RevoltServer.js";
import RevoltUser from "../models/RevoltUser.js";
import RevoltClient from "../RevoltClient.js";
import MessageContext from "./MessageContext.js";

export default class RevoltMessageContext
	<InGuild extends boolean = false> extends MessageContext<InGuild>
{
	private _splitArgs: string[];
	private message: Message;

	public author: RevoltUser;
	public client: RevoltClient;
	public command?: Command;
	public server: If<InGuild, RevoltServer>;

	constructor(
		author: RevoltUser,
		client: RevoltClient,
		message: Message,
		server: If<InGuild, RevoltServer>
	) {
		super();
		this.author = author;
		this.client = client;
		this.message = message;
		this.server = server;

		const parsedInput = parseInput(
			this.client,
			this.content as string,
			this.mode,
			this.prefix,
			"REVOLT"
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

	get mode() {
		if (this.message.content?.indexOf(`${this.prefix}#`) === 0) return "ADMIN";
		if (this.message.content?.indexOf(`${this.prefix}?`) === 0) return "HELP";
		if (this.message.content?.indexOf(`${this.prefix}-`) === 0) return "IMAGE";
		return "NORMAL";
	}

	get channel() {
		return this.message.channel as Channel;
	}

	get content() {
		return this.message.content;
	}

	get createdAt() {
		return new Date(this.message.createdAt);
	}

	get embeds() {
		return this.message.embeds;
	}

	get member() {
		return this.message.member as If<InGuild, Member>;
	}

	get mentions() {
		return this.message.mentions;
	}

	get prefix() {
		return this.server?.base.prefix || "";
	}

	async delete() {
		return this.message.delete();
	}

	async fetchServer(id: string) {
		return this.client.servers.fetchRevolt(id);
	}

	async fetchUser(id: string) {
		return this.client.users.fetchRevolt(id);
	}

	async reply(content: string | Embed) {
		try {
			if (content instanceof Embed) {
				this.channel.startTyping();
				const embed = await content.toRevoltEmbed();
				return this.message.reply({ embeds: [embed] }) as Promise<Message>;
			}
			return this.message.reply(content) as Promise<Message>;
		} catch(err) {
			console.error(err);
			return this.error(
				"CUSTOM",
				`Please report the issue with some context (e.g. what command did you use, when) using \`${this.prefix}bugreport\`.`,
				"Something has gone wrong."
			) as Promise<Message>;
		}
	}
}
