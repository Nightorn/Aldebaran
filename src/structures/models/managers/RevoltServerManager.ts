import { ServerCacheMap } from "../../../utils/Constants.js";
import RevoltClient from "../../RevoltClient.js";
import RevoltServer from "../RevoltServer.js";
import Server from "../Server.js";
import ServerManager from "./ServerManager.js";

export default class RevoltServerManager extends ServerManager {
	private revoltCache: ServerCacheMap<string, RevoltServer> = new Map();

	public client: RevoltClient;

	public constructor(client: RevoltClient) {
		super();
		this.client = client;
	}

	public async cacheRevolt(server: RevoltServer, base: Server) {
		server.base = base;
		server.server = await this.client.revolt.servers.fetch(server.id);
		RevoltServerManager.cache(this.revoltCache, server);
		return server;
	}

	public async createRevolt(id: string) {
		const server = await this.createGuild();
		const s = await RevoltServer.create({ id: id, serverId: server.id });
		return this.cacheRevolt(s, server);
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
}
