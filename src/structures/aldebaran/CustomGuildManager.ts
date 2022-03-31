import { BaseFetchOptions, CachedManager as CM, GuildResolvable as GuildR, Snowflake } from "discord.js";
import AldebaranClient from "../djs/Client.js";
import Guild from "../djs/Guild.js";

export default class CustomGuildManager extends CM<Snowflake, Guild, GuildR> {
	bot: AldebaranClient;

	constructor(bot: AldebaranClient) {
		super(bot, Guild);
		this.bot = bot;
	}

	async create(id: string) {
		return this.bot.database.guilds.createOneById(id);
	}

	async delete(id: string) {
		return this.bot.database.guilds.deleteOneById(id);
	}

	async fetch(id: string, options?: BaseFetchOptions) {
		const guild = this.cache.get(id);
		const djsGuild = await this.bot.guilds.fetch({ guild: id, ...options });
		if (guild && !(options && options.force)) {
			return guild;
		}
		const data = await this.bot.database.guilds.selectOneById(id);
		if (data) {
			const fetchedGuild = new Guild(this.bot, djsGuild, data);
			if (!(options && options.cache === false)) {
				this.cache.set(id, fetchedGuild);
			}
			return fetchedGuild;
		}
		await this.create(id);
		const guildData = { guildid: id, settings: "{}", commands: "{}" };
		const fetchedGuild = new Guild(this.bot, djsGuild, guildData);
		if (!(options && options.cache === false)) {
			this.cache.set(id, fetchedGuild);
		}
		return fetchedGuild;
	}
}
