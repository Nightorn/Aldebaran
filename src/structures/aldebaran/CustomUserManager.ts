import { BaseFetchOptions, CachedManager as CM, Snowflake, UserResolvable as UserR } from "discord.js";
import AldebaranClient from "../djs/Client.js";
import User from "../djs/User.js";

export default class CustomUserManager extends CM<Snowflake, User, UserR> {
	bot: AldebaranClient;

	constructor(bot: AldebaranClient) {
		super(bot, User);
		this.bot = bot;
	}

	async create(id: string) {
		return this.bot.database.users.createOneById(id);
	}

	async delete(id: string) {
		return this.bot.database.users.deleteOneById(id);
	}

	async fetch(id: string, options?: BaseFetchOptions) {
		const user = this.cache.get(id);
		const djsUser = await this.bot.users.fetch(id, options);
		if (user && !(options && options.force)) {
			return user;
		}
		const data = await this.bot.database.users.selectOneById(id);
		if (data) {
			const fetchedUser = new User(this.bot, djsUser, data);
			if (!(options && options.cache === false)) {
				this.cache.set(id, fetchedUser);
			}
			return fetchedUser;
		}
		await this.create(id);
		const userData = { userId: id, settings: "{}" };
		const fetchedUser = new User(this.bot, djsUser, userData);
		if (!(options && options.cache === false)) {
			this.cache.set(id, fetchedUser);
		}
		return fetchedUser;
	}
}
