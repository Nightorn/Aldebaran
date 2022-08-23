import { UserCacheMap } from "../../../utils/Constants.js";
import DiscordClient from "../../DiscordClient.js";
import DiscordUser from "../DiscordUser.js";
import User from "../User.js";
import UserManager from "./UserManager.js";

export default class DiscordUserManager extends UserManager {
	private discordCache: UserCacheMap<string, DiscordUser> = new Map();

	public client: DiscordClient;

	public constructor(client: DiscordClient) {
		super();
		this.client = client;
	}

	public async cacheDiscord(user: DiscordUser, base: User) {
		user.base = base;
		user.user = await this.client.discord.users.fetch(user.id);
		DiscordUserManager.cache(this.discordCache, user);
		return user;
	}

	public async createDiscord(id: string) {
		const user = await this.createUser();
		const u = await DiscordUser.create({ snowflake: id, userId: user.id });
		return this.cacheDiscord(u, user);
	}

	public async fetchDiscord(id: string) {
		const cached = this.discordCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const u = await DiscordUser.findOne({ where: { snowflake: id } });
			if (!u) {
				return this.createDiscord(id);
			} else {
				const base = await this.fetchUser(u.userId);
				return this.cacheDiscord(u, base);
			}
		}
		return cached.user;
	}
}
