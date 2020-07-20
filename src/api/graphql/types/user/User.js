const DiscordStructWithSettings = require("../common/DiscordStructWithSettings");
const GuildsConnection = require("../guild/GuildsConnection");
const SocialProfile = require("../SocialProfile");
const fetchDSMValue = require("../../utils/fetchDSMValue");

module.exports = class User extends DiscordStructWithSettings {
	constructor(id, joinedTimestamp) {
		super(id);
		this.joinedTimestamp = joinedTimestamp || null;
	}

	/**
	 * Returns the avatar URL of the current user.
	 * @param {*} request Request object
	 * @returns {string}
	 */
	async avatarURL(_, request) {
		const query = `const user = this.users.cache.get("${this.ID}"); user ? user.avatarURL({ format: 'png', size: 64 }) : null;`;
		return fetchDSMValue(request.app.dsm, query, 2);
	}

	/**
	 * Returns the guilds both Aldebaran and the current user are in.
	 */
	mutualServers({ ...args }) {
		return new GuildsConnection({ user: this.ID, ...args });
	}

	/**
	 * Returns the profile associated with this user.
	 */
	async profile() {
		return new SocialProfile(this.ID);
	}

	/**
	 * Returns the username of the current user.
	 * @param {*} request Request object
	 * @returns {string}
	 */
	async username(_, request) {
		const query = `this.users.cache.get("${this.ID}")`;
		return fetchDSMValue(request.app.dsm, query, 2, "username");
	}

	/**
	 * Fetches the settings of the current user from the database.
	 * @param {*} db The DatabaseProvider of the application
	 */
	async querySettings(db) {
		const results = await db.query(`SELECT settings FROM users WHERE userId="${this.ID}"`);
		return results.length > 0 ? JSON.parse(results[0].settings) : null;
	}
};
