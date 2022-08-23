import { ImageSize } from "@discordjs/rest";
import Embed from "../structures/Embed.js";
import User from "../structures/models/User.js";

export default interface ContextUser {
	base: User;
	id: string;

	get avatarURL(): string;
	get createdAt(): Date;
	get tag(): string;
	get username(): string;

	getAvatarURL(size?: ImageSize): string;
	send(content: string | Embed): Promise<unknown>;
	toString(): string;
}
