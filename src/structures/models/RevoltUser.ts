import { DataTypes, Model } from "sequelize";
import ContextUser from "../../interfaces/ContextUser.js";
import { tableConf } from "../../utils/Methods.js";
import User from "./User.js";

export default class RevoltUser extends Model implements ContextUser {
	declare public id: string;
	declare public userId: number;

	declare public base: User; // inclusion

	get avatarURL(): string {
		throw new Error("Method not implemented.");
	}

	get createdAt(): Date {
		throw new Error("Method not implemented.");
	}

	get tag(): string {
		throw new Error("Method not implemented.");
	}
	
	get username(): string {
		throw new Error("Method not implemented.");
	}
	
	toString(): string {
		throw new Error("Method not implemented.");
	}
}

RevoltUser.init({
	id: { type: DataTypes.CHAR(26), primaryKey: true }
}, tableConf("user_revolt"));
