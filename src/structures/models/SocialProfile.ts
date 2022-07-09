import { DataTypes, Model } from "sequelize";
import { tableConf } from "../../utils/Methods.js";
import User from "./User.js";

export default class SocialProfile extends Model {
	declare private id: number;
	declare public aboutMe: string;
	declare public birthday: Date;
	declare public country: string;
	declare public dmFriendly: boolean;
	declare public favoriteGames: string;
	declare public favoriteMusic: string;
	declare public flavorText: string;
	declare public fortunePoints: number;
	declare public gender: string;
	declare public hobbies: string;
	declare public name: string;
	declare public profilePictureLink: string;
	declare public profileColor: string;
	declare public socialLinks: string;
}

SocialProfile.init({
	id: { type: DataTypes.INTEGER, primaryKey: true	},
	aboutMe: { type: DataTypes.STRING(2000), defaultValue: null },
	birthday: { type: DataTypes.DATE, defaultValue: null },
	country: { type: DataTypes.STRING(100), defaultValue: null },
	dmFriendly: { type: DataTypes.BOOLEAN, defaultValue: null },
	favoriteGames: { type: DataTypes.STRING(1000), defaultValue: null },
	favoriteMusic: { type: DataTypes.STRING(1000), defaultValue: null },
	flavorText: { type: DataTypes.STRING(2000), defaultValue: null },
	fortunePoints: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
	gender: { type: DataTypes.STRING(100), defaultValue: null },
	hobbies: { type: DataTypes.STRING(2000), defaultValue: null },
	name: { type: DataTypes.STRING(100), defaultValue: null },
	profilePictureLink: { type: DataTypes.STRING(1000), defaultValue: null },
	profileColor: { type: DataTypes.STRING(20), defaultValue: null },
	socialLinks: { type: DataTypes.STRING(1000), defaultValue: null }
}, tableConf("user_profile"));
