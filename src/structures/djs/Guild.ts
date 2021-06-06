/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import { Guild as DJSGuild, Collection as C } from "discord.js";
import Settings from "../../interfaces/Settings";
import AldebaranClient from "./Client";
import User from "./User";

function sanitize(data: string | number) {
	return data.toString().replace(/[\\"]/g, "\\$&");
}

export default class Guild extends DJSGuild {
	client!: AldebaranClient;
	commands: Settings = {};
	existsInDB: boolean = false;
	prefix: string = process.env.PREFIX || "&";
	ready: boolean = false;
	settings: Settings = {};
	polluxBoxPing: C<string, User> = new C<string, User>();

	async changeCommandSetting(property: string, value: string) {
		this.commands[property] = value;
		if (value) delete this.commands[property];
		if (!this.client.commands.exists(property) && !value)
			delete this.commands[property];
		return this.client.database.guilds.updateOneById(
			this.id,
			new Map([["commands", JSON.stringify(this.commands)]])
		);
	}

	async changeSetting(property: string, value: string) {
		await this.create();
		this.settings[property] = value;
		const toSave = { ...this.settings };
		for (const setting in toSave) {
			toSave[setting] = sanitize(toSave[setting]);
		}
		return this.client.database.guilds.updateOneById(
			this.id,
			new Map([["settings", JSON.stringify(toSave)]])
		);
	}

	async clear() {
		this.existsInDB = false;
		this.settings = {};
		return this.client.database.guilds.deleteOneById(this.id);
	}

	async create() {
		if (this.existsInDB) return false;
		this.existsInDB = true;
		return this.client.database.guilds.createOneById(this.id);
	}

	async fetch() {
		const data = await this.client.database.guilds.selectOneById(this.id);
		this.existsInDB = data !== undefined;
		this.ready = true;
		if (data !== undefined) {
			if (data.settings.includes("\\") && !data.settings.includes("\\\\") && !data.settings.includes("\\\"")) {
				// Escape the escape symbol if it's not escaped. Should only run for like 1 guild maybe.
				data.settings = JSON.parse(data.settings.replace(/\\/g, "\\\\"));
			} else data.settings = JSON.parse(data.settings);
			data.commands = JSON.parse(data.commands);
			if (data !== undefined) {
				for (const [key, value] of Object.entries(data.settings)) {
					this.settings[key.toLowerCase()] = value as number | string;
				}
				this.commands = data.commands;
			}
			this.prefix = this.client.debugMode && process.env.PREFIX
				? process.env.PREFIX
				: this.settings.aldebaranprefix as string || "&";
			this.polluxBoxPing = new C();
		}
		return data;
	}
};
