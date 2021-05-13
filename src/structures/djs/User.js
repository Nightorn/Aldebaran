const SocialProfile = require("../aldebaran/SocialProfile");
const AldebaranPermissions = require("../aldebaran/AldebaranPermissions");

module.exports = BaseUser => class User extends BaseUser {
	constructor(client, data) {
		super(client, data);
		this.generalCooldown = 0;
		this.settings = {};
		this.permissions = new AldebaranPermissions(0);
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
			this.permissions = new AldebaranPermissions(data.permissions || 0);
			data.settings = JSON.parse(data.settings);
			for (const [key, value] of Object.entries(data))
				if (key !== "userId" && key !== "permissions") this[key] = value;
		}
		return data;
	}

	async getProfile() {
		if (this.profile === undefined) this.profile = new SocialProfile(this);
		if (!this.profile.ready) await this.profile.fetch();
		return this.profile;
	}

	hasPermission(permission) {
		return this.permissions.has(AldebaranPermissions.FLAGS.ADMINISTRATOR)
			|| this.permissions.has(AldebaranPermissions.FLAGS[permission]);
	}

	/**
	 * Removes permissions from a user
	 * @param {string[]} permissions Array of permission flags to remove
	 */
	async removePermissions(permissions) {
		permissions.forEach(permission => {
			if (Object.keys(AldebaranPermissions.FLAGS).includes(permission))
				this.permissions.remove(AldebaranPermissions.FLAGS[permission]);
		});
		this.unready();
		return this.client.database.users.updateOneById(
			this.id,
			new Map([["permissions", AldebaranPermissions.resolve(this.permissions.bitfield)]])
		);
	}

	/**
	 * Adds permissions to a user
	 * @param {string[]} permissions Array of permission flags to add
	 */
	async addPermissions(permissions) {
		permissions.forEach(permission => {
			if (Object.keys(AldebaranPermissions.FLAGS).includes(permission))
				this.permissions.add(AldebaranPermissions.FLAGS[permission]);
		});
		this.unready();
		return this.client.database.users.updateOneById(
			this.id,
			new Map([["permissions", AldebaranPermissions.resolve(this.permissions.bitfield)]])
		);
	}

	unready() {
		this.client.shard.broadcastEval(`if (this.users.cache.get("${this.id}") !== undefined && this.shardID !== ${this.client.shardID}) this.users.cache.get("${this.id}").ready = false`);
	}
};
