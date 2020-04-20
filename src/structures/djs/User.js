const SocialProfile = require("../aldebaran/SocialProfile");
const permissions = require("../../../assets/data/aldebaranPermissions.json");

module.exports = BaseUser => class User extends BaseUser {
	constructor(client, data) {
		super(client, data);
		this.generalCooldown = 0;
		this.settings = {};
		this.timers = {
			adventure: null,
			padventure: null,
			sides: null
		};
	}

	get banned() {
		return this.timeout > Date.now();
	}

	get customTimers() {
		const timers = new Map();
		for (const [id, timer] of this.client.customTimers)
			if (timer.userId === this.id)
				timers.set(id, timer);
		return timers;
	}

	async changeSetting(property, value) {
		await this.create();
		this.settings[property] = value;
		this.unready();
		return this.client.database.users.updateOneById(
			this.id,
			new Map([["settings", JSON.stringify(this.settings)]])
		);
	}

	async clear() {
		this.existsInDB = false;
		this.settings = {};
		return this.client.database.users.deleteOneById(this.id);
	}

	async create() {
		if (this.existsInDB) return false;
		this.existsInDB = true;
		return this.client.database.users.createOneById(this.id);
	}

	async fetch() {
		const data = await this.client.database.users.selectOneById(this.id);
		this.existsInDB = data !== undefined;
		this.ready = true;
		if (data !== undefined) {
			data.settings = JSON.parse(data.settings);
			for (const [key, value] of Object.entries(data))
				if (key !== "userId") this[key] = value;
		}
		return data;
	}

	async getProfile() {
		if (this.profile === undefined) this.profile = new SocialProfile(this);
		if (!this.profile.ready) await this.profile.fetch();
		return this.profile;
	}

	hasPermission(permission) {
		if (this.permissions & permissions.ADMINISTRATOR) return true;
		return this.permissions & permissions[permission];
	}

	unready() {
		this.client.shard.broadcastEval(`if (this.users.cache.get("${this.id}") !== undefined && this.shardID !== ${this.client.shardID}) this.users.cache.get("${this.id}").ready = false`);
	}
};
