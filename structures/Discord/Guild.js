/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const { Collection } = require("discord.js");

module.exports = BaseGuild => class Guild extends BaseGuild {
	constructor(client, data) {
		super(client, data);
		this.commands = {};
		this.settings = {};
		this.prefix = this.client.config.prefix;
		this.existsInDB = false;
		const interval = setInterval(() => {
			if (this.client.databaseFetch !== undefined) {
				if (
					this.client.databaseFetch.data.guilds.size
						=== this.client.databaseFetch.counts.guilds
				) {
					clearInterval(interval);
					if (
						this.client.databaseFetch.data.guilds.get(this.id) !== undefined
					) {
						this.build(this.client.databaseFetch.data.guilds.get(this.id));
					}
				}
			}
		}, 100);
	}

	build(data) {
		for (const [key, value] of Object.entries(data)) this[key] = value;
		this.settings = JSON.parse(this.settings);
		this.commands = JSON.parse(this.commands);
		this.prefix = this.client.debugMode
			? this.client.config.prefix
			: this.settings.aldebaranPrefix || this.client.config.prefix;
		this.polluxBoxPing = new Collection();
		this.existsInDB = true;
	}

	async create() {
		if (this.existsInDB) return false;
		this.existsInDB = true;
		return this.client.database.guilds.createOneById(this.id);
	}

	async clear() {
		this.existsInDB = false;
		this.settings = {};
		return this.client.database.guilds.deleteOneById(this.id);
	}

	async changeSetting(property, value) {
		this.settings[property] = value;
		return this.client.database.guilds.updateOneById(
			this.id,
			new Map([["settings", JSON.stringify(this.settings)]])
		);
	}

	async changeCommandSetting(property, value) {
		this.commands[property] = value;
		if (value === true) delete this.commands[property];
		return this.client.database.guilds.updateOneById(
			this.id,
			new Map([["commands", JSON.stringify(this.commands)]])
		);
	}
};
