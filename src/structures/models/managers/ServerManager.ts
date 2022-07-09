import DiscordServer from "../DiscordServer.js";
import RevoltServer from "../RevoltServer.js";
import Server from "../Server.js";
import ServerSetting from "../ServerSetting.js";
import Client from "../../Client.js";

const TTL = 300000;

type CacheMap<K, T> = Map<K, { server: T, expires: number }>;

function encap(server: any) {
	return { server, expires: Date.now() + TTL };
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
		server.guild = await this.client.discord.guilds.fetch(server.id);
		this.discordCache.set(server.id, encap(server));
		return server;
	}

    public async cacheRevolt(server: RevoltServer, base: Server) {
        server.base = base;
        this.revoltCache.set(server.id, encap(server));
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
		this.serverCache.set(server.id, encap(server));
		return server;
	}

	public async fetchDiscord(id: string) {
		const cached = this.discordCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const s = await DiscordServer.findOne({ where: { snowflake: id } });
			if (!s) {
				await this.createDiscord(id);
			} else {
				const base = await this.fetchServer(s.serverId);
				await this.cacheDiscord(s, base);
			}
		}
		return this.discordCache.get(id)!.server;
	}

	public async fetchRevolt(id: string) {
		const cached = this.revoltCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const s = await RevoltServer.findByPk(id);
			if (!s) {
				await this.createRevolt(id);
			} else {
				const base = await this.fetchServer(s.serverId);
                await this.cacheRevolt(s, base);
			}
		}
		return this.revoltCache.get(id)!.server;
	}

	public async fetchServer(id: number) {
		const cached = this.serverCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const s = await Server.findByPk(id, { include: {
                as: "settings",
				model: ServerSetting
			} })
			if (s) {
				this.serverCache.set(id, encap(s));
			} else {
                throw new RangeError("The given ID is not associated to any server in the database.");
            }
		}
		return this.serverCache.get(id)!.server;
	}
}
