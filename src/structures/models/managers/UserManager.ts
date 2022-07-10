import DiscordUser from "../DiscordUser.js";
import RevoltUser from "../RevoltUser.js";
import User from "../User.js";
import UserSetting from "../UserSetting.js";
import Client from "../../Client.js";
import { deduplicateSettings } from "../../../utils/Methods.js";

const TTL = 300000;

type CacheMap<K, T> = Map<K, { user: T, expires: number }>;

function encap(user: any) {
	return { user, expires: Date.now() + TTL };
}

export default class UserManager {
	private discordCache: CacheMap<string, DiscordUser> = new Map();
	private revoltCache: CacheMap<string, RevoltUser> = new Map();
	private userCache: CacheMap<number, User> = new Map();

	public client: Client;

	public constructor(client: Client) {
		this.client = client;
	}

	public async cacheDiscord(user: DiscordUser, base: User) {
		user.base = base;
        user.base.settings = await deduplicateSettings(user.base.settings);
		user.user = await this.client.discord.users.fetch(user.id);
		this.discordCache.set(user.id, encap(user));
		return user;
	}

    public async cacheRevolt(user: RevoltUser, base: User) {
        user.base = base;
        user.base.settings = await deduplicateSettings(user.base.settings);
		this.revoltCache.set(user.id, encap(user));
        return user;
    }

	public async createDiscord(id: string) {
		const user = await this.createUser();
		const u = await DiscordUser.create({ snowflake: id, userId: user.id });
		return this.cacheDiscord(u, user);
	}

	public async createRevolt(id: string) {
		const user = await this.createUser();
		const u = await RevoltUser.create({ ulid: id, userId: user.id });
        return this.cacheRevolt(u, user);
	}

	public async createUser() {
		const user = await User.create();
		this.userCache.set(user.id, encap(user));
		return user;
	}

	public async fetchDiscord(id: string) {
		const cached = this.discordCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const u = await DiscordUser.findOne({ where: { snowflake: id } });
			if (!u) {
				await this.createDiscord(id);
			} else {
				const base = await this.fetchUser(u.userId);
				await this.cacheDiscord(u, base);
			}
		}
		return this.discordCache.get(id)!.user;
	}

	public async fetchRevolt(id: string) {
		const cached = this.revoltCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const u = await RevoltUser.findByPk(id);
			if (!u) {
				await this.createRevolt(id);
			} else {
				const base = await this.fetchUser(u.userId);
                await this.cacheRevolt(u, base);
			}
		}
		return this.revoltCache.get(id)!.user;
	}

	public async fetchUser(id: number) {
		const cached = this.userCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const u = await User.findByPk(id, { include: {
				as: "settings",
				model: UserSetting
			} });
			if (u) {
				this.userCache.set(id, encap(u));
			} else {
                throw new RangeError("The given ID is not associated to any user in the database.");
            }
		}
		return this.userCache.get(id)!.user;
	}
}
