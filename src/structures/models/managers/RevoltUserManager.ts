import { UserCacheMap } from "../../../utils/Constants.js";
import RevoltClient from "../../RevoltClient.js";
import RevoltUser from "../RevoltUser.js";
import User from "../User.js";
import UserManager from "./UserManager.js";

export default class RevoltUserManager extends UserManager {
	private revoltCache: UserCacheMap<string, RevoltUser> = new Map();

	public client: RevoltClient;

	public constructor(client: RevoltClient) {
		super();
		this.client = client;
	}

	public async cacheRevolt(user: RevoltUser, base: User) {
		user.base = base;
		user.user = await this.client.revolt.users.fetch(user.id);
		RevoltUserManager.cache(this.revoltCache, user);
		return user;
	}

	public async createRevolt(id: string) {
		const user = await this.createUser();
		const u = await RevoltUser.create({ id: id, userId: user.id });
		return this.cacheRevolt(u, user);
	}

	public async fetchRevolt(id: string) {
		const cached = this.revoltCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const u = await RevoltUser.findByPk(id);
			if (!u) {
				return this.createRevolt(id);
			} else {
				const base = await this.fetchUser(u.userId);
				return this.cacheRevolt(u, base);
			}
		}
		return cached.user;
	}
}
