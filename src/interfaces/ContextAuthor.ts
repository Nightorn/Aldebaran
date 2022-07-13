import User from "../structures/models/User.js";

export default interface ContextAuthor {
	base: User;
	id: string;

	get avatarURL(): string;
	get tag(): string;
	get username(): string;

	toString(): string;
}
