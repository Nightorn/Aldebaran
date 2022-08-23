import { MessageOptions, MessageEmbed, CommandInteraction, GuildMember, Message, InteractionReplyOptions, TextBasedChannel } from "discord.js";
import Command from "../../groups/Command.js";
import { CommandMode, If } from "../../utils/Constants";
import DiscordClient from "../DiscordClient.js";
import Embed from "../Embed.js";
import Server from "../models/DiscordServer.js";
import User from "../models/DiscordUser.js";
import DiscordContext from "./DiscordContext.js";

type M = Promise<Message<boolean>>;
type DefaultMessage = string | Embed | MessageEmbed;
export default class DiscordSlashMessageContext
	<InGuild extends boolean = false> extends DiscordContext<InGuild>
{
	private interaction: CommandInteraction;
	public command: Command;

	constructor(
		client: DiscordClient,
		interaction: CommandInteraction,
		author: User,
		server: If<InGuild, Server>
	) {
		super(author, client, server);
		this.interaction = interaction;
		
		const subcommand = interaction.options.getSubcommand(false);
		if (subcommand) {
			this.command = (client.commands
				.get(interaction.commandName, "DISCORD_SLASH") as Command).subcommands
				.get(subcommand) as Command;
		} else {
			this.command = client.commands
				.get(interaction.commandName, "DISCORD_SLASH") as Command;
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
		return this.interaction.channel as TextBasedChannel;
	}

	get createdAt() {
		return new Date(this.interaction.createdTimestamp);
	}

	get member() {
		return this.interaction.member as If<InGuild, GuildMember>;
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
		ephemeral = false,
		fetchReply = false
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

	async reply(content: DefaultMessage | MessageOptions): Promise<never>;
	async reply<B extends boolean>(
		content: DefaultMessage | InteractionReplyOptions,
		ephemeral?: boolean,
		fetchReply?: B
	): Promise<B extends true ? Message<boolean> : void>; 

	async reply(
		content: DefaultMessage | MessageOptions | InteractionReplyOptions,
		ephemeral = false,
		fetchReply = false
	) {
		if (content instanceof Embed) {
			const embed = content.toDiscordEmbed();
			return this.interaction.reply({ embeds: [embed], ephemeral, fetchReply });
		} else if (content instanceof MessageEmbed) {
			return this.interaction.reply({ embeds: [content], ephemeral, fetchReply });
		} else if (typeof content === "string") {
			return this.interaction.reply({ content, ephemeral, fetchReply });
		} else {
			const args = { ...content, ephemeral, fetchReply };
			return this.interaction.reply(args as InteractionReplyOptions);
		}
	}
}
