import Server from "../Server.js";
import ServerSetting from "../ServerSetting.js";
import { deduplicateSettings } from "../../../utils/Methods.js";
import { ServerCacheMap } from "../../../utils/Constants.js";

export default class ServerManager {
	private serverCache: ServerCacheMap<number, Server> = new Map();

	public static cache<K, T extends { id: K }>(
		cache: ServerCacheMap<K, T>,
		server: T
	) {
		cache.set(server.id, { server, expires: Date.now() + 300000 });
	}

	public async createGuild() {
		const server = await Server.create();
		server.settings = [];
		ServerManager.cache(this.serverCache, server);
		return server;
	}

	public async fetchServer(id: number) {
		const cached = this.serverCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const s = await Server.findByPk(id, { include: {
				as: "settings",
				model: ServerSetting
			} });
			if (s) {
				s.settings = await deduplicateSettings(s.settings);
				ServerManager.cache(this.serverCache, s);
				return s;
			} else {
				throw new RangeError("The given ID is not associated to any server in the database.");
			}
		}
		return cached.server;
	}
}
