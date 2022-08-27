import { EmbedBuilder, ChatInputCommandInteraction, GuildMember, Message, InteractionReplyOptions, TextBasedChannel, MessagePayload, InteractionResponse } from "discord.js";
import Command from "../../groups/Command.js";
import { CommandMode, If } from "../../utils/Constants";
import DiscordClient from "../DiscordClient.js";
import Embed from "../Embed.js";
import Server from "../models/DiscordServer.js";
import User from "../models/DiscordUser.js";
import DiscordContext from "./DiscordContext.js";

type DefaultMessage = string | Embed | EmbedBuilder | MessagePayload;
export default class DiscordSlashMessageContext
	<InGuild extends boolean = false> extends DiscordContext<InGuild>
{
	private interaction: ChatInputCommandInteraction;
	public command: Command;

	constructor(
		client: DiscordClient,
		interaction: ChatInputCommandInteraction,
		author: User,
		server: If<InGuild, Server>
	) {
		super(author, client, server);
		this.interaction = interaction;
		
		interaction.options.data
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

	async reply(content: DefaultMessage): Promise<never>;
	async reply<B extends boolean>(
		content: DefaultMessage |  InteractionReplyOptions,
		ephemeral?: boolean,
		fetchReply?: B
	): Promise<B extends true ? Message<boolean> : InteractionResponse<boolean>>; 

	async reply(
		content: DefaultMessage | InteractionReplyOptions,
		ephemeral = false,
		fetchReply = false
	) {
		const replyMethod = this.interaction.replied
			? this.interaction.followUp.bind(this.interaction)
			: this.interaction.reply.bind(this.interaction);

		if (content instanceof Embed) {
			const embed = content.toDiscordEmbed();
			return replyMethod({ embeds: [embed], ephemeral, fetchReply });
		} else if (content instanceof EmbedBuilder) {
			return replyMethod({ embeds: [content], ephemeral, fetchReply });
		} else if (typeof content === "string") {
			return replyMethod({ content, ephemeral, fetchReply });
		} else {
			const args = { ...content, ephemeral, fetchReply };
			return replyMethod(args as InteractionReplyOptions);
		}
	}
}
