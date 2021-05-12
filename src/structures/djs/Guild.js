/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const { Collection } = require("discord.js");

function sanitize(data) {
	return data.replace(/[\\"]/g, "\\$&");
}

module.exports = BaseGuild => class Guild extends BaseGuild {
	constructor(client, data) {
		super(client, data);
		this.commands = {};
		this.prefix = process.env.PREFIX;
		this.settings = {};
	}

	async changeCommandSetting(property, value) {
		this.commands[property] = value;
		if (value === true) delete this.commands[property];
		if (!this.client.commands.exists(property) && value === false)
			delete this.commands[property];
		return this.client.database.guilds.updateOneById(
			this.id,
			new Map([["commands", JSON.stringify(this.commands)]])
		);
	}

	async changeSetting(property, value) {
		await this.create();
		this.settings[property] = value;
		const toSave = Object.assign({}, this.settings);
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
				for (const [key, value] of Object.entries(JSON.parse(data.settings))) {
					this.settings[key.toLowerCase()] = value;
				}
				for (const [key, value] of Object.entries(data))
					if (!["guildid", "settings"].includes(key)) this[key] = value;
			}
			this.prefix = this.client.debugMode
				? process.env.PREFIX
				: this.settings.aldebaranprefix || process.env.PREFIX;
			this.polluxBoxPing = new Collection();
		}
		return data;
	}
};
