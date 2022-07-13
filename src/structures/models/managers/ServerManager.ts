import DiscordServer from "../DiscordServer.js";
import RevoltServer from "../RevoltServer.js";
import Server from "../Server.js";
import ServerSetting from "../ServerSetting.js";
import Client from "../../Client.js";
import { deduplicateSettings } from "../../../utils/Methods.js";

type CacheMap<K, T> = Map<K, { server: T, expires: number }>;

function cache<K, T extends { id: K }>(cache: CacheMap<K, T>, server: T) {
	cache.set(server.id, { server, expires: Date.now() + 300000 });
}

export default class ServerManager {
	private discordCache: CacheMap<string, DiscordServer> = new Map();
	private revoltCache: CacheMap<string, RevoltServer> = new Map();
	private serverCache: CacheMap<number, Server> = new Map();

	public client: Client;

	public constructor(client: Client) {
		this.client = client;
	}

	public async cacheDiscord(server: DiscordServer, base: Server) {
		server.base = base;
		server.base.settings = await deduplicateSettings(server.base.settings);
		server.guild = await this.client.discord.guilds.fetch(server.id);
		cache(this.discordCache, server);
		return server;
	}

	public async cacheRevolt(server: RevoltServer, base: Server) {
		server.base = base;
		server.base.settings = await deduplicateSettings(server.base.settings);
		cache(this.revoltCache, server);
		return server;
	}

	public async createDiscord(id: string) {
		const server = await this.createGuild();
		const s = await DiscordServer.create({ snowflake: id, serverId: server.id });
		return this.cacheDiscord(s, server);
	}

	public async createRevolt(id: string) {
		const server = await this.createGuild();
		const s = await RevoltServer.create({ ulid: id, serverId: server.id });
		return this.cacheRevolt(s, server);
	}

	public async createGuild() {
		const server = await Server.create();
		cache(this.serverCache, server);
		return server;
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

	public async fetchRevolt(id: string) {
		const cached = this.revoltCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const s = await RevoltServer.findByPk(id);
			if (!s) {
				return this.createRevolt(id);
			} else {
				const base = await this.fetchServer(s.serverId);
				return this.cacheRevolt(s, base);
			}
		}
		return cached.server;
	}

	public async fetchServer(id: number) {
		const cached = this.serverCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const s = await Server.findByPk(id, { include: {
				as: "settings",
				model: ServerSetting
			} });
			if (s) {
				cache(this.serverCache, s);
				return s;
			} else {
				throw new RangeError("The given ID is not associated to any server in the database.");
			}
		}
		return cached.server;
	}
}
