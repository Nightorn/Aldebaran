import { Client, Snowflake, User as DJSUser } from "discord.js";
import AldebaranPermissions from "../aldebaran/AldebaranPermissions.js";
import AldebaranClient from "./Client.js";
import { DBUser, Permissions, PermissionString, UserSetting, UserSettings } from "../../utils/Constants.js";

export default class User {
	client!: AldebaranClient;
	generalCooldown: number = 0;
	id: Snowflake;
	permissions: AldebaranPermissions = new AldebaranPermissions(0);
	ready: boolean = false;
	settings: UserSettings = {};
	timers: {
		adventure: NodeJS.Timeout | null,
		padventure: NodeJS.Timeout | null,
		sides: NodeJS.Timeout | null
	} = { adventure: null, padventure: null, sides: null };
	timeout: number = 0;
	user: DJSUser;
	username: string;

	constructor(client: AldebaranClient, user: DJSUser, data: DBUser) {
		this.client = client;
		this.id = data.userId;
		this.permissions = new AldebaranPermissions(data.permissions || 0);
		for (const [k, v] of Object.entries(JSON.parse(data.settings))) {
			this.settings[k.toLowerCase() as UserSetting] = v as string;
		}
		this.timeout = data.timeout || 0;
		this.user = user;
		this.username = user.username;
	}

	get avatarURL() {
		return this.user.displayAvatarURL();
	}

	get banned() {
		return this.timeout > Date.now();
	}

	async changeSetting(property: UserSetting, value: string) {
		this.settings[property] = value;
		this.unready();
		return this.client.database.users.updateOneById(
			this.id,
			new Map([["settings", JSON.stringify(this.settings)]])
		);
	}

	async profile() {
		return this.client.customProfiles.fetch(this.id);
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
			this.permissions.add(Permissions[permission]);
		});
		this.unready();
		return this.client.database.users.updateOneById(
			this.id,
			new Map([["permissions", AldebaranPermissions.resolve(this.permissions.bitfield)]])
		);
	}

	unready() {
		this.client.shard!.broadcastEval((c: Client, { shardId, id }) => {
			if (c.shard!.ids[0] !== shardId) {
				(c as AldebaranClient).customUsers.cache.delete(id);
			}
		}, { context: { shardId: this.client.shardId, id: this.id } });
	}
};
