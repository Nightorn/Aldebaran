const SocialProfile = require("../aldebaran/SocialProfile");
const permissions = require("../../../assets/data/aldebaranPermissions.json");

module.exports = BaseUser => class User extends BaseUser {
	constructor(client, data) {
		super(client, data);
		this.asBotStaff = this.client.config.aldebaranTeam[this.id] || null;
		this.existsInDB = false;
		this.generalCooldown = 0;
		this.profile = new SocialProfile(this);
		this.settings = {};
		if (this.client.databaseData.users.get(this.id) !== undefined) {
			const dbData = this.client.databaseData.users.get(this.id);
			for (const [key, value] of Object.entries(dbData)) this[key] = value;
			this.settings = JSON.parse(this.settings);
			this.existsInDB = true;
		}
		this.timers = {
			adventure: null,
			padventure: null,
			sides: null
		};
	}

	get banned() {
		return this.timeout > Date.now();
	}

	hasPermission(permission) {
		if (this.permissions & permissions.ADMINISTRATOR) return true;
		return this.permissions & permissions[permission];
	}

	get customTimers() {
		const timers = new Map();
		for (const [id, timer] of this.client.customTimers)
			if (timer.userId === this.id)
				timers.set(id, timer);
		return timers;
	}

	async create() {
		if (this.existsInDB) return false;
		this.existsInDB = true;
		return this.client.database.users.createOneById(this.id);
	}

	async clear() {
		this.existsInDB = false;
		this.settings = {};
		return this.client.database.users.deleteOneById(this.id);
	}

	async changeSetting(property, value) {
		await this.create();
		this.settings[property] = value;
		return this.client.database.users.updateOneById(
			this.id,
			new Map([["settings", JSON.stringify(this.settings)]])
		);
	}
};
