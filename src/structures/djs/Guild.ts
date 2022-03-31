import { Guild as DJSGuild, Collection as C, Snowflake } from "discord.js";
import AldebaranClient from "./Client.js";
import User from "./User.js";
import { DBGuild, GuildSetting, GuildSettings } from "../../utils/Constants.js";

function sanitize(data: string | number) {
	return data.toString().replace(/[\\"]/g, "\\$&");
}

export default class Guild {
	client!: AldebaranClient;
	guild: DJSGuild;
	id: Snowflake;
	polluxBoxPing: C<string, User> = new C<string, User>();
	prefix: string = process.env.PREFIX || "&";
	ready: boolean = false;
	settings: GuildSettings = {};

	constructor(client: AldebaranClient, guild: DJSGuild, data: DBGuild) {
		this.client = client;
		this.guild = guild;
		this.id = data.guildid;
		for (const [k, v] of Object.entries(JSON.parse(data.settings))) {
			this.settings[k.toLowerCase() as GuildSetting] = v as string;
		}
		this.prefix = this.client.debugMode && process.env.PREFIX
			? process.env.PREFIX
			: this.settings.aldebaranprefix as string || "&";
	}

	async changeSetting(property: GuildSetting, value: string) {
		this.settings[property] = value;
		if (property === "aldebaranprefix") {
			this.prefix = value;
		}
		const toSave = { ...this.settings };
		for (const [k, v] of Object.entries(toSave)) {
			toSave[k as keyof typeof toSave] = sanitize(v);
		}
		return this.client.database.guilds.updateOneById(
			this.id,
			new Map([["settings", JSON.stringify(toSave)]])
		);
	}
}
