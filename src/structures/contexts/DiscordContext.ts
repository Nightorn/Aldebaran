import { If } from "../../utils/Constants.js";
import MessageContext from "./MessageContext.js";
import DiscordClient from "../DiscordClient.js";
import DiscordUser from "../models/DiscordUser.js";
import DiscordServer from "../models/DiscordServer.js";
import { GuildMember, Message, EmbedBuilder, MessagePayload, BaseMessageOptions } from "discord.js";
import Embed from "../Embed.js";

export default abstract class DiscordContext
	<InGuild extends boolean = false>extends MessageContext<InGuild>
{
	public author: DiscordUser;
	public client: DiscordClient;
	public server: If<InGuild, DiscordServer>;

	constructor(
		author: DiscordUser,
		client: DiscordClient,
		server: If<InGuild, DiscordServer>
	) {
		super();
		this.author = author;
		this.client = client;
		this.server = server;
	}

	abstract get member(): If<InGuild, GuildMember>;

	abstract reply(
		content: string | Embed | MessagePayload | BaseMessageOptions | EmbedBuilder
	): Promise<Message<boolean>>;

	async fetchServer(id: string) {
		return this.client.servers.fetchDiscord(id);
	}

	async fetchUser(id: string) {
		return this.client.users.fetchDiscord(id);
	}
}