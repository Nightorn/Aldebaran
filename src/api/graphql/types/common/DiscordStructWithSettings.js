module.exports = class DiscordStructWithSettings {
	constructor(id) {
		if (this.constructor.name === "DiscordStructWithSettings") return;
		const check = id.match(/\d{17,19}/);
		if (check === null)
			throw new TypeError("The specified ID does not match the format of a ID.");
		else this.ID = check[0];
	}

	/**
	 * Returns the ID of the current structure.
	 * @returns {string}
	 */
	async id() {
		return this.ID;
	}

	/**
	 * Returns the settings of the current structure, if any.
	 * @param {object} args Request arguments
	 * @param {string[]} args.keys Request arguments
	 * @param {*} request Request object
	 * @returns {string[]}
	 */
	async settings({ keys }, request) {
		const u = await this.querySettings(request.app.db);
		return u !== null ? keys.reduce((acc, cur) => [...acc, u[cur]], []) : [];
	}
};
