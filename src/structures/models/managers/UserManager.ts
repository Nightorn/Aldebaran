import User from "../User.js";
import UserSetting from "../UserSetting.js";
import { UserCacheMap } from "../../../utils/Constants.js";

export default class UserManager {
	private userCache: UserCacheMap<number, User> = new Map();

	public static cache<K, T extends { id: K }>(
		cache: UserCacheMap<K, T>,
		user: T
	) {
		cache.set(user.id, { user, expires: Date.now() + 300000 });
	}

	public async createUser() {
		const user = await User.create();
		UserManager.cache(this.userCache, user);
		return user;
	}

	public async fetchUser(id: number) {
		const cached = this.userCache.get(id);
		if (!cached || cached.expires < Date.now()) {
			const u = await User.findByPk(id, { include: {
				as: "settings",
				model: UserSetting
			} });
			if (u) {
				UserManager.cache(this.userCache, u);
				return u;
			} else {
				throw new RangeError("The given ID is not associated to any user in the database.");
			}
		}
		return cached.user;
	}
}
