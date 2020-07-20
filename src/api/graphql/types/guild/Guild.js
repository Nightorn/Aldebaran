const DiscordStructWithSettings = require("../common/DiscordStructWithSettings");
const UsersConnection = require("../user/UsersConnection");
const fetchDSMValue = require("../../utils/fetchDSMValue");

module.exports = class Guild extends DiscordStructWithSettings {
	/**
	 * Returns the timestamp representing the date of creation of the guild.
	 * @param {*} request Request object
	 * @returns {Promise<number>}
	 */
	async createdTimestamp(_, request) {
		const query = `this.guilds.cache.get("${this.ID}")`;
		return fetchDSMValue(request.app.dsm, query, 2, "createdTimestamp");
	}

	/**
	 * Returns the avatar URL of the current guild.
	 * @param {*} request Request object
	 * @returns {string}
	 */
	async iconURL(_, request) {
		const query = `const guild = this.guilds.cache.get("${this.ID}"); guild ? guild.iconURL({ format: 'png', size: 64 }) : null;`;
		return fetchDSMValue(request.app.dsm, query, 2);
	}

	/**
	 * Returns the members of this guild.
	 */
	members({ ...args }) {
		return new UsersConnection({ guild: this.ID, ...args });
	}

	/**
	 * Returns the username of the current user.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async name(_, request) {
		const query = `this.guilds.cache.get("${this.ID}")`;
		return fetchDSMValue(request.app.dsm, query, 2, "name");
	}

	/**
	 * Fetches the settings of the current guild from the database.
	 * @param {*} db The DatabaseProvider of the application
	 */
	async querySettings(db) {
		const results = await db.query(`SELECT settings FROM guilds WHERE guildid="${this.ID}"`);
		return results.length > 0 ? JSON.parse(results[0].settings) : null;
	}
};
