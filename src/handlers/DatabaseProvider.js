const GenericDatabaseProvider = require("./GenericDatabaseProvider");

module.exports = class DatabaseProvider extends GenericDatabaseProvider {
	/**
	 * Returns a MySQL pool connection to the Aldebaran's database
	 */
	constructor(client) {
		super();
		this.client = client;
		this.users = {
			/**
			 * Returns the data of the user specified from the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (id, columns) => {
				const check = await this.constructor.checkSelectOneById(id, columns);
				if (check instanceof RangeError) return check;
				return (await this.query(
					`SELECT ${
						columns !== undefined ? columns.join(", ") : "*"
					} FROM users WHERE userId='${id}'`
				))[0];
			},
			/**
			 * Returns the data of all users from the database
			 */
			selectAll: async () => this.query("SELECT * FROM users"),
			/**
			 * Updates the data of the user specified on the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {Map} changes Changes to make to the user, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
			 */
			updateOneById: async (id, changes) => {
				const updates = this.constructor.convertChangesMapToString(changes);
				return this.query(
					`UPDATE users SET ${updates.join(", ")} WHERE userId='${id}'`
				);
			},
			/**
			 * Deletes the data of the user specified on the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			deleteOneById: async id => this.query(`DELETE FROM users WHERE userId='${id}'`),
			/**
			 * Inserts a user in the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			createOneById: async id => this.query(
				`INSERT INTO users (userId, settings) VALUES ('${id}', '{}')`
			)
		};
		this.guilds = {
			/**
			 * Returns the data of the guild specified from the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (id, columns) => {
				const check = await this.constructor.checkSelectOneById(id, columns);
				if (check instanceof RangeError) return check;
				return (await this.query(
					`SELECT ${
						columns !== undefined ? columns.join(", ") : "*"
					} FROM guilds WHERE guildid='${id}'`
				))[0];
			},
			/**
			 * Returns the data of all users from the database
			 */
			selectAll: async () => this.query("SELECT * FROM guilds"),
			/**
			 * Updates the data of the guild specified on the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 * @param {Map} changes Changes to make to the guild, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
			 */
			updateOneById: async (id, changes) => {
				const updates = this.constructor.convertChangesMapToString(changes);
				return this.query(
					`UPDATE guilds SET ${updates.join(", ")} WHERE guildid='${id}'`
				);
			},
			/**
			 * Deletes the data of the guild specified on the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 */
			deleteOneById: async id => this.query(`DELETE FROM guilds WHERE guildid='${id}'`),
			/**
			 * Inserts a guild in the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 */
			createOneById: async id => this.query(
				`INSERT INTO guilds (guildid, settings, commands) VALUES ('${id}', '{}', '{}')`
			)
		};
		this.socialprofile = {
			/**
			 * Returns the data of the profile specified from the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (id, columns) => {
				const check = await this.constructor.checkSelectOneById(id, columns);
				if (check instanceof RangeError) return check;
				return (await this.query(
					`SELECT ${
						columns !== undefined ? columns.join(", ") : "*"
					} FROM socialprofile WHERE userId='${id}'`
				))[0];
			},
			/**
			 * Returns the data of all users from the database
			 */
			selectAll: async () => this.query("SELECT * FROM socialprofile"),
			/**
			 * Updates the data of the profile specified on the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {Map} changes Changes to make to the profile, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
			 */
			updateOneById: async (id, changes) => {
				const updates = this.constructor.convertChangesMapToString(changes);
				return this.query(
					`UPDATE socialprofile SET ${updates.join(", ")} WHERE userId='${id}'`
				);
			},
			/**
			 * Deletes the data of the profile specified on the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			deleteOneById: async id => this.query(`DELETE FROM socialprofile WHERE userId='${id}'`),
			/**
			 * Inserts a profile in the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			createOneById: async id => this.query(
				`INSERT INTO socialprofile (userId) VALUES ('${id}')`
			)
		};
		this.timers = {
			selectAll: async () => this.query("SELECT * FROM timers")
		};
		this.photogallery = {
			/**
			 * Returns the data of the photo specified from the database
			 * @param {string} id ID of the photo
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (id, columns) => (await this.query(
				`SELECT ${
					columns !== undefined ? columns.join(", ") : "*"
				} FROM photogallery WHERE id='${id}'`
			))[0],
			/**
			 * Returns a random photo from the database
			 * @param {boolean} nsfw Return NSFW Content
			 * @param {string[]} columns Columns to retrieve in the returned data
			 * @param {number} limit Number of photos to return
			 */
			selectRandom: async (nsfw, columns = [], limit = 1) => this.query(
				`SELECT ${
					columns.length > 0 ? columns.join(", ") : "*"
				} FROM photogallery WHERE nsfw=${
					nsfw ? 1 : 0
				} ORDER BY RAND() LIMIT ${limit}`
			),
			/**
			 * Updates the data of the photo specified on the database
			 * @param {string} id ID of the photo
			 * @param {Map} changes Changes to make to the photo, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
			 */
			updateById: async (id, changes) => {
				const updates = this.constructor.convertChangesMapToString(changes);
				return this.query(
					`UPDATE photogallery SET ${updates.join(", ")} WHERE id='${id}'`
				);
			},
			/**
			 * Deletes the data of the photo specified on the database
			 * @param {string} id ID of the photo
			 */
			deleteById: async id => this.query(`DELETE FROM photogallery WHERE id='${id}'`),
			/**
			 * Inserts a photo in the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 * @param {string} link URL of the Image
			 * @param {string} linkname Title of the Image
			 * @param {string[]} tags Tags of the Image
			 * @param {boolean} nsfw NSFW Content
			 */
			create: async (id, link, linkname, tags, nsfw) => this.query(
				`INSERT INTO photogallery (userId, links, linkname, tags, nsfw) VALUES ('${id}', '${link}', '${linkname}', '${tags}', ${nsfw})`
			)
		};
		this.commands = {
			create: async (command, args, message) => this.query(
				`INSERT INTO commands (command, userId, channelId, guildId, args) VALUES ('${command}', '${
					message.author.id
				}', '${message.channel.id}', '${message.guild.id}', '${JSON.stringify(
					args
				)}')`
			)
		};
	}

	static checkSelectOneById(id, columns) {
		if (columns !== undefined && !(columns instanceof Array))
			return new RangeError("The columns property is not an Array object.");
		return true;
	}

	static checkUpdateOneById(id, changes) {
		if (!(changes instanceof Map))
			return new RangeError("The changes property is not a Map object.");
		if (changes.size === 0)
			return new RangeError("You need to specify at least one change.");
		return true;
	}

	static convertChangesMapToString(changes) {
		const updates = [];
		for (const [key, value] of changes)
			updates.push(
				`${key}=${typeof value === "number" ? value : `'${value}'`}`
			);
		return updates;
	}
};
