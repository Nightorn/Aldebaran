import { DataTypes, Model } from "sequelize";
import Setting from "../../interfaces/Setting.js";
import { ServerSettingKey } from "../../utils/Constants.js";
import { tableConf } from "../../utils/Methods.js";
import Server from "./Server.js";

export default class ServerSetting extends Model implements Setting {
    declare private id: number;
    declare public serverId: number;
    declare public key: ServerSettingKey;
    declare public value: string;

    declare public server: Server; // inclusion
}

ServerSetting.init({
    key: { type: DataTypes.STRING(100), allowNull: false },
    value: { type: DataTypes.STRING(100), allowNull: false }
}, tableConf("server_setting"));
