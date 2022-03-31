import { BaseFetchOptions, CachedManager as CM, Snowflake as Snow, UserResolvable as UserR } from "discord.js";
import AldebaranClient from "../djs/Client.js";
import Profile from "./SocialProfile.js";

export default class CustomProfileManager extends CM<Snow, Profile, UserR> {
	bot: AldebaranClient;

	constructor(bot: AldebaranClient) {
		super(bot, Profile);
		this.bot = bot;
	}

	async create(id: string) {
		return this.bot.database.socialprofile.createOneById(id);
	}

	async delete(id: string) {
		return this.bot.database.socialprofile.deleteOneById(id);
	}

	async fetch(id: string, options?: BaseFetchOptions) {
		const profile = this.cache.get(id);
		const user = await this.bot.customUsers.fetch(id, options);
		if (profile && options && !options.force) {
			return profile;
		}
		const data = await this.bot.database.socialprofile.selectOneById(id);
		if (data) {
			const fetchedProfile = new Profile(this.bot, user, data);
			if (!(options && options.cache === false)) {
				this.cache.set(id, fetchedProfile);
			}
			return fetchedProfile;
		}
		await this.create(id);
		const fetchedProfile = new Profile(this.bot, user);
		if (!(options && options.cache === false)) {
			this.cache.set(id, fetchedProfile);
		}
		return fetchedProfile;
	}
}
