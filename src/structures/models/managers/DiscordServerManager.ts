import { ServerCacheMap } from "../../../utils/Constants.js";
import DiscordClient from "../../DiscordClient.js";
import DiscordServer from "../DiscordServer.js";
import Server from "../Server.js";
import ServerManager from "./ServerManager.js";

export default class DiscordServerManager extends ServerManager {
	private discordCache: ServerCacheMap<string, DiscordServer> = new Map();

	public client: DiscordClient;

	public constructor(client: DiscordClient) {
		super();
		this.client = client;
	}

	public async cacheDiscord(server: DiscordServer, base: Server) {
		server.base = base;
		server.guild = await this.client.discord.guilds.fetch(server.id);
		DiscordServerManager.cache(this.discordCache, server);
		return server;
	}

	public async createDiscord(id: string) {
		const server = await this.createGuild();
		const s = await DiscordServer.create({ snowflake: id, serverId: server.id });
		return this.cacheDiscord(s, server);
	}

	public async fetchDiscord(id: string) {
		const cached = this.discordCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const s = await DiscordServer.findOne({ where: { snowflake: id } });
			if (!s) {
				return this.createDiscord(id);
			} else {
				const base = await this.fetchServer(s.serverId);
				return this.cacheDiscord(s, base);
			}
		}
		return cached.server;
	}
}
