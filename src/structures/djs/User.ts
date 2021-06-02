import { User as DJSUser } from "discord.js";
import SocialProfile from "../aldebaran/SocialProfile";
import AldebaranPermissions from "../aldebaran/AldebaranPermissions";
import Settings from "../../interfaces/Settings";

export default (BaseUser: typeof DJSUser) => class User extends BaseUser {
	generalCooldown: number = 0;
	settings: Settings = {};
	permissions: AldebaranPermissions = new AldebaranPermissions(0);
	timers: {} = { adventure: null, padventure: null, sides: null };
	timeout: number = 0;
	existsInDB: boolean = false;
	ready: boolean = false;
	profile: any;

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

	async changeSetting(property: string, value: string) {
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
		if (data) {
			data.settings = JSON.parse(data.settings);
			for (const [key, value] of Object.entries(data.settings)) {
				this.settings[key.toLowerCase()] = value as string | number;
			}
			this.timeout = data.timeout || 0;
			this.permissions = new AldebaranPermissions(data.permissions || 0);
		}
		return data;
	}

	async getProfile() {
		if (this.profile === undefined) this.profile = new SocialProfile(this);
		if (!this.profile.ready) await this.profile.fetch();
		return this.profile;
	}

	hasPermission(permission: string) {
		if (process.env.BOT_ADMIN === this.id) return true;
		return this.permissions.has(AldebaranPermissions.FLAGS.ADMINISTRATOR)
			|| this.permissions.has(AldebaranPermissions.FLAGS[permission]);
	}

	/**
	 * Removes permissions from a user
	 */
	async removePermissions(permissions: string[]) {
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
	 */
	async addPermissions(permissions: string[]) {
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
