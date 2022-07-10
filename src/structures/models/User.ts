import { Model, DataTypes, HasOneGetAssociationMixin, HasManyCreateAssociationMixin, HasOneCreateAssociationMixin } from "sequelize";
import AldebaranPermissions from "../AldebaranPermissions.js";
import { Permissions, PermissionString, UserSettingKey } from "../../utils/Constants.js";
import { tableConf } from "../../utils/Methods.js";
import Profile from "./Profile.js";
import UserSetting from "./UserSetting.js";

class User extends Model {
	declare public settings: UserSetting[]; // Sequelize inclusion
	declare public id: number;
	declare public permissions: AldebaranPermissions;

	declare private createSetting: HasManyCreateAssociationMixin<UserSetting>;
    declare public createProfile: HasOneCreateAssociationMixin<Profile>;
	declare public getProfile: HasOneGetAssociationMixin<Profile>;

	/**
	 * Adds permissions to a user
	 */
	async addPermissions(permissions: PermissionString[]) {
		permissions.forEach(permission => {
			this.permissions.add(Permissions[permission]);
		});
		return this.save();
	}

	hasPermission(permission: PermissionString) {
		if (process.env.BOT_ADMIN === this.id.toString()) return true;
		return this.permissions.has(Permissions.ADMINISTRATOR)
			|| this.permissions.has(Permissions[permission]);
	}

	findSetting(key: UserSettingKey) {
		return this.settings.find(s => s.key === key);
	}

	getSetting(key: UserSettingKey) {
		return this.findSetting(key)?.value;
	}

	/**
	 * Removes permissions from a user
	 */
	async removePermissions(permissions: PermissionString[]) {
		permissions.forEach(permission => {
			if (Object.keys(Permissions).includes(permission))
				this.permissions.remove(Permissions[permission]);
		});
		this.save();
	}

	async setSetting(key: UserSettingKey, value: string) {
		const setting = this.findSetting(key);
		if (setting) {
			await setting.set({ key, value }).save();
		} else {
			const created = await this.createSetting({ key, value });
            this.settings.push(created);
		}
        return this.findSetting(key)!;
	}
}

User.init({
	permissions: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
		get() {
			return new AldebaranPermissions(this.getDataValue("permissions"))
		},
		set(value: AldebaranPermissions) {
			this.setDataValue("permissions", value.bitfield);
		}
	}
}, tableConf("user"));

export default User;
