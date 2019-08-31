const SocialProfile = require("../Aldebaran/SocialProfile.js");
const staffRoles = require("../../Data/staffRoles.json");

module.exports = BaseUser => class User extends BaseUser {
	constructor(client, data) {
		super(client, data);
		this.asBotStaff = this.client.config.aldebaranTeam[this.id] || null;
		this.banned = false;
		this.existsInDB = false;
		this.generalCooldown = 0;
		this.profile = new SocialProfile(this);
		this.settings = {};
		const interval = setInterval(() => {
			if (this.client.databaseFetch !== undefined) {
				if (
					this.client.databaseFetch.data.users.size
					=== this.client.databaseFetch.counts.users
				) {
					clearInterval(interval);
					if (
						this.client.databaseFetch.data.users.get(this.id) !== undefined
					) {
						this.build(this.client.databaseFetch.data.users.get(this.id));
					}
				}
			}
		}, 100);
		this.timers = {
			adventure: null,
			padventure: null,
			sides: null,
			travel: null
		};
	}

	build(data) {
		for (const [key, value] of Object.entries(data)) this[key] = value;
		this.settings = JSON.parse(this.settings);
		this.existsInDB = true;
	}

	checkPerms(perm) {
		if (this.asBotStaff === null) return false;
		if (this.asBotStaff.acknowledgements.includes("ADMIN")) return true;
		if (perm === "MODERATOR") return this.asBotStaff.acknowledgements.includes("MODERATOR");
		return false;
	}

	hasPerm(perm) {
		const guild = this.client.guilds.get("461792163525689345");
		if (guild === undefined) return false;
		const member = guild.members.get(this.id);
		if (member === undefined) return false;
		const { roles } = member;
		const perms = [];
		let rank = 99;
		if (roles !== undefined) {
			roles.each(role => {
				if (Object.keys(staffRoles).includes(role.id)) {
					perms.push(staffRoles[role.id].name);
					const permRank = staffRoles[role.id].rank;
					if (rank > permRank) rank = permRank;
				}
			});
			Object.values(staffRoles).forEach(data => {
				if (data.rank >= rank && !perms.includes(data.name))
					perms.push(data.name);
			});
		}
		return perms.includes(perm);
	}

	get highestPerm() {
		let rank = 99;
		let perm = null;
		const guild = this.client.guilds.get("461792163525689345");
		if (guild === undefined) return null;
		const member = guild.members.get(this.id);
		if (member === undefined) return null;
		const { roles } = member;
		if (roles !== undefined) {
			roles.each(role => {
				for (const [id, data] of Object.entries(staffRoles)) {
					if (role.id === id) {
						if (data.rank < rank) {
							// eslint-disable-next-line prefer-destructuring
							rank = data.rank;
							perm = data.name;
						}
					}
				}
			});
		}
		return perm;
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
		this.settings[property] = value;
		return this.client.database.users.updateOneById(
			this.id,
			new Map([["settings", JSON.stringify(this.settings)]])
		);
	}
};
