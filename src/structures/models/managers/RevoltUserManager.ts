import { UserCacheMap } from "../../../utils/Constants";
import RevoltUser from "../RevoltUser";
import User from "../User";
import UserManager from "./UserManager";

export default class RevoltUserManager extends UserManager {
	private revoltCache: UserCacheMap<string, RevoltUser> = new Map();

	public async cacheRevolt(user: RevoltUser, base: User) {
		user.base = base;
		RevoltUserManager.cache(this.revoltCache, user);
		return user;
	}

	public async createRevolt(id: string) {
		const user = await this.createUser();
		const u = await RevoltUser.create({ ulid: id, userId: user.id });
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
