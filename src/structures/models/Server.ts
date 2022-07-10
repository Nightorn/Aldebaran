import { DataTypes, HasManyCreateAssociationMixin, Model } from "sequelize";
import ServerSetting from "./ServerSetting.js";
import { tableConf } from "../../utils/Methods.js";
import { ServerSettingKey } from "../../utils/Constants.js";

class Server extends Model {
	declare public settings: ServerSetting[]; // Sequelize inclusion
	declare public blacklisted: boolean;
	declare public id: number;
    
	declare private createSetting: HasManyCreateAssociationMixin<ServerSetting>;

	get prefix() {
		const prefix = this.getSetting("aldebaranprefix") || "&";
		return (process.argv[2] === "dev" ? process.env.PREFIX || "&" : prefix);
	}

	findSetting(key: ServerSettingKey) {
		return this.settings.find(s => s.key === key);
	}

	getSetting(key: ServerSettingKey) {
		return this.findSetting(key)?.value;
	}

	async setSetting(key: ServerSettingKey, value: string) {
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

Server.init({
	blacklisted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 }
}, tableConf("server"));

export default Server;
