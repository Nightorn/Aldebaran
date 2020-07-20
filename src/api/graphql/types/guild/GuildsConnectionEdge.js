module.exports = class GuildsConnectionEdge {
	/**
	 * A connection edge for users, as specified by the GraphQL specification.
	 * @param {*} guild The Discord guild
	 */
	constructor(guild) {
		this.guild = guild;
	}

	/**
	 * Returns the cursor of the current element in the connection.
	 */
	async cursor(_, request) {
		const timestamp = await this.guild.createdTimestamp(_, request);
		return Buffer.from(timestamp.toString()).toString("base64");
	}

	/**
	 * Returns the node (in this case, a user) of the current element in the connection.
	 */
	node() {
		return this.guild;
	}
};
