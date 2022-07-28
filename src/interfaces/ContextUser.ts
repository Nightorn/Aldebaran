import { ImageSize } from "@discordjs/rest";
import User from "../structures/models/User.js";

export default interface ContextUser {
	base: User;
	id: string;

	get avatarURL(): string;
	get createdAt(): Date;
	get tag(): string;
	get username(): string;

	getAvatarURL(size?: ImageSize): string;
	toString(): string;
}
