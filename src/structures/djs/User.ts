import { User as DJSUser } from "discord.js";
import SocialProfile from "../aldebaran/SocialProfile";
import AldebaranPermissions from "../aldebaran/AldebaranPermissions";
import Settings from "../../interfaces/Settings";
import AldebaranClient from "./Client";
import { Permissions, PermissionString } from "../../utils/Constants";

export default class User extends DJSUser {
	client!: AldebaranClient;
	generalCooldown: number = 0;
	settings: Settings = {};
	permissions: AldebaranPermissions = new AldebaranPermissions(0);
	timeout: number = 0;
	existsInDB: boolean = false;
	ready: boolean = false;
	profile: any;

	get banned() {
		return this.timeout > Date.now();
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

	hasPermission(permission: PermissionString) {
		if (process.env.BOT_ADMIN === this.id) return true;
		return this.permissions.has(Permissions.ADMINISTRATOR)
			|| this.permissions.has(Permissions[permission]);
	}

	/**
	 * Removes permissions from a user
	 */
	async removePermissions(permissions: PermissionString[]) {
		permissions.forEach(permission => {
			if (Object.keys(Permissions).includes(permission))
				this.permissions.remove(Permissions[permission]);
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
	async addPermissions(permissions: PermissionString[]) {
		permissions.forEach(permission => {
			if (Object.keys(Permissions).includes(permission))
				this.permissions.add(Permissions[permission]);
		});
		this.unready();
		return this.client.database.users.updateOneById(
			this.id,
			new Map([["permissions", AldebaranPermissions.resolve(this.permissions.bitfield)]])
		);
	}

	unready() {
		(this.client.shard)!.broadcastEval(`if (this.users.cache.get("${this.id}") !== undefined && this.shardID !== ${this.client.shardID}) this.users.cache.get("${this.id}").ready = false`);
	}
};
