import { User as RjsUser } from "revolt.js";
import { DataTypes, Model } from "sequelize";
import ContextUser from "../../interfaces/ContextUser.js";
import { tableConf } from "../../utils/Methods.js";
import Embed from "../Embed.js";
import User from "./User.js";

export default class RevoltUser extends Model implements ContextUser {
	declare public id: string;
	declare public userId: number;

	declare public base: User; // inclusion
	declare public user: RjsUser;

	get avatarURL() {
		return this.getAvatarURL();
	}

	get createdAt() {
		return new Date(this.user.createdAt);
	}

	get tag() {
		return this.user.username;
	}
	
	get username() {
		return this.user.username;
	}

	public getAvatarURL() {
		return this.user.avatar
			? `https://autumn.revolt.chat/avatars/${this.user.avatar._id}`
			: this.user.defaultAvatarURL;
	}

	public async send(content: string | Embed) {
		const channel = await this.user.openDM();
		if (content instanceof Embed) {
			const embed = await content.toRevoltEmbed();
			return channel.sendMessage({ embeds: [embed] });
		} else {
			return channel.sendMessage(content);
		}
	}
	
	public toString() {
		return `<@${this.user._id}>`;
	}
}

RevoltUser.init({
	id: { type: DataTypes.CHAR(26), primaryKey: true }
}, tableConf("user_revolt"));
