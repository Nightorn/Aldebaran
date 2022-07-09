import { DataTypes, Model } from "sequelize";
import { UserSettingKey } from "../../utils/Constants.js";
import { tableConf } from "../../utils/Methods.js";
import User from "./User.js";

export default class UserSetting extends Model {
    declare private id: number;
    declare public userId: number;
    declare public key: UserSettingKey;
    declare public value: string;

    declare public user: User; // inclusion
}

UserSetting.init({
    key: { type: DataTypes.STRING(100), allowNull: false },
    value: { type: DataTypes.STRING(100), allowNull: false }
}, tableConf("user_setting"));
