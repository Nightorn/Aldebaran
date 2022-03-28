import User from "./User.js";

export default class UsersConnectionEdge {
	user: User;

	/**
	 * A connection edge for users, as specified by the GraphQL specification.
	 * @param {*} user The Discord member
	 */
	constructor(user: User) {
		this.user = user;
	}

	/**
	 * Returns the cursor of the current element in the connection.
	 */
	cursor() {
		return Buffer.from(this.user.joinedTimestamp!.toString()).toString("base64");
	}

	/**
	 * Returns the node (in this case, a user) of the current element in the connection.
	 */
	node() {
		return this.user;
	}
};
