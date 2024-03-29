import { ImageSize } from "@discordjs/rest";
import { User as DjsUser } from "discord.js";
import { DataTypes, Model } from "sequelize";
import ContextUser from "../../interfaces/ContextUser.js";
import { tableConf } from "../../utils/Methods.js";
import Embed from "../Embed.js";
import User from "./User.js";

export default class DiscordUser extends Model implements ContextUser {
	declare private _id: number;
	declare public snowflake: string;
	declare public userId: number;

	declare public base: User; // Sequelize inclusion
	declare public user: DjsUser;

	public timers: {
		adventure: NodeJS.Timeout | null,
		padventure: NodeJS.Timeout | null,
		sides: NodeJS.Timeout | null
	} = { adventure: null, padventure: null, sides: null };

	get avatarURL() {
		return this.getAvatarURL();
	}

	get createdAt() {
		return new Date(this.user.createdTimestamp);
	}

	get id() {
		return this.snowflake;
	}

	get tag() {
		return this.user.tag;
	}

	get username() {
		return this.user.username;
	}

	public getAvatarURL(size: ImageSize = 32) {
		return this.user.displayAvatarURL({ size });
	}

	public async send(content: string | Embed) {
		if (content instanceof Embed) {
			return this.user.send({ embeds: [content.toDiscordEmbed()] });
		} else {
			return this.user.send(content);
		}
	}

	public toString() {
		return this.user.toString();
	}
}

DiscordUser.init({
	_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: "id"
	},
	snowflake: {
		type: DataTypes.STRING(19),
		allowNull: false,
		unique: true
	}
}, tableConf("user_discord"));
