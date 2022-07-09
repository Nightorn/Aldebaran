import { MessageOptions, MessageEmbed, CommandInteraction, GuildMember, Message, InteractionReplyOptions } from "discord.js";
import Command from "../../groups/Command.js";
import { CommandMode } from "../../utils/Constants";
import Client from "../Client.js";
import DiscordServer from "../models/DiscordServer.js";
import DiscordUser from "../models/DiscordUser.js";
import MessageContext from "./MessageContext.js";

type M = Promise<Message<boolean>>;
export default class DiscordSlashMessageContext extends MessageContext {
	private interaction: CommandInteraction;
	public author: DiscordUser;
	public command: Command;
	public server?: DiscordServer;

	constructor(
		client: Client,
		interaction: CommandInteraction,
		author: DiscordUser,
		server?: DiscordServer
	) {
		super(client);
		this.author = author;
		this.server = server;
		this.interaction = interaction;
        
		const subcommand = interaction.options.getSubcommand(false);
		if (subcommand) {
			this.command = client.commands.get(interaction.commandName, "DISCORD_SLASH")!
				.subcommands.get(subcommand)!;
		} else {
			this.command = client.commands.get(interaction.commandName, "DISCORD_SLASH")!;
		}
	}

	get args() {
		const args: { [key: string]: string | number | boolean | undefined } = {};
		if (this.command.metadata.args) {
			Object.keys(this.command.metadata.args).forEach(k => {
				args[k] = this.interaction.options.get(k.toLowerCase())?.value;
			});
		}
		return args;
	}

	get channel() {
		return this.interaction.channel!;
	}

	get createdTimestamp() {
		return this.interaction.createdTimestamp;
	}

	get member() {
		return this.interaction.inGuild()
			? this.interaction.member as GuildMember
			: null;
	}
    
	get mode(): CommandMode {
		return "NORMAL";
	}

	get prefix() {
		return "/";
	}

	async delete(): Promise<false> {
		return false;
	}

	async followUp(
		content: string | InteractionReplyOptions | MessageEmbed,
		ephemeral: boolean = false,
		fetchReply: boolean = false
	) {
		if (content instanceof MessageEmbed) {
			return this.interaction
				.followUp({ embeds: [content], ephemeral, fetchReply }) as M;
		} else if (typeof content === "string") {
			return this.interaction.followUp({ content, fetchReply }) as M;
		} else {
			return this.interaction.followUp({ ...content, fetchReply }) as M;
		}
	}

	async reply(content: string | MessageOptions | MessageEmbed): Promise<never>;
	async reply<B extends boolean>(
		content: string | InteractionReplyOptions | MessageEmbed,
		ephemeral?: boolean,
		fetchReply?: B
	): Promise<B extends true ? Message<boolean> : void>; 

	async reply(
		content: string | MessageOptions | InteractionReplyOptions | MessageEmbed,
		ephemeral: boolean = false,
		fetchReply: boolean = false
	) {
		if (content instanceof MessageEmbed) {
			return this.interaction.reply({ embeds: [content], ephemeral, fetchReply });
        } else if (typeof content === "string") {
			return this.interaction.reply({ content, ephemeral, fetchReply });
		} else {
			return this.interaction.reply({ ...content, ephemeral, fetchReply } as InteractionReplyOptions);
		}
	}
}
