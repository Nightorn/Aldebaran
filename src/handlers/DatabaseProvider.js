const { Guild } = require("discord.js");
const mysql = require("mysql");

module.exports = class DatabasePool {
	/**
	 * Returns a MySQL pool connection to the Aldebaran's database
	 */
	constructor(client) {
		if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER
			|| !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE
		) throw new TypeError("The database configuration is invalid");
		this.client = client;
		this.pool = mysql.createPool({
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
			connectTimeout: 60000,
			acquireTimeout: 60000,
			timeout: 60000
		});
		this.users = {
			/**
			 * Returns the data of the user specified from the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (id, columns) => {
				const check = await this.checkSelectOneById(id, columns);
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
			deleteOneById: async id => {
				const check = await this.checkId(id);
				if (check instanceof RangeError) return check;
				return this.query(`DELETE FROM users WHERE userId='${id}'`);
			},
			/**
			 * Inserts a user in the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			createOneById: async id => {
				const check = await this.checkId(id);
				if (check instanceof RangeError) return check;
				return this.query(
					`INSERT INTO users (userId, settings) VALUES ('${id}', '{}')`
				);
			}
		};
		this.guilds = {
			/**
			 * Returns the data of the guild specified from the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (id, columns) => {
				const check = await this.checkSelectOneById(id, columns);
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
			deleteOneById: async id => {
				const check = await this.checkId(id);
				if (check instanceof RangeError) return check;
				return this.query(`DELETE FROM guilds WHERE guildid='${id}'`);
			},
			/**
			 * Inserts a guild in the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 */
			createOneById: async id => {
				const check = await this.checkId(id);
				if (check instanceof RangeError) return check;
				return this.query(
					`INSERT INTO guilds (guildid, settings, commands) VALUES ('${id}', '{}', '{}')`
				);
			}
		};
		this.socialprofile = {
			/**
			 * Returns the data of the profile specified from the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (id, columns) => {
				const check = await this.checkSelectOneById(id, columns);
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
			deleteOneById: async id => {
				const check = await this.checkId(id);
				if (check instanceof RangeError) return check;
				return this.query(`DELETE FROM socialprofile WHERE userId='${id}'`);
			},
			/**
			 * Inserts a profile in the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			createOneById: async id => {
				const check = await this.checkId(id);
				if (check instanceof RangeError) return check;
				return this.query(
					`INSERT INTO socialprofile (userId) VALUES ('${id}')`
				);
			}
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
			create: async (id, link, linkname, tags, nsfw) => {
				const check = await this.checkId(id);
				if (check instanceof RangeError) return check;
				return this.query(
					`INSERT INTO photogallery (userId, links, linkname, tags, nsfw) VALUES ('${id}', '${link}', '${linkname}', '${tags}', ${nsfw})`
				);
			}
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

	async checkIntegrity() {
		if ((await this.query("SHOW TABLES LIKE \"users\"", true)).length === 0)
			await this.query("CREATE TABLE `users` (`userId` varchar(20) CHARACTER SET utf8 NOT NULL, `settings` text CHARACTER SET utf8 NOT NULL, `permissions` mediumint(9) DEFAULT NULL, `timeout` bigint(20) DEFAULT NULL, UNIQUE KEY `userId` (`userId`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		if ((await this.query("SHOW TABLES LIKE \"guilds\"", true)).length === 0)
			await this.query("CREATE TABLE `guilds` (`guildid` tinytext CHARACTER SET utf8, `settings` text CHARACTER SET utf8, `commands` text COLLATE utf8mb4_bin NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		if ((await this.query("SHOW TABLES LIKE \"socialprofile\"", true)).length === 0)
			await this.query("CREATE TABLE `socialprofile` (`userId` tinytext CHARACTER SET utf8, `name` text CHARACTER SET utf8, `country` text CHARACTER SET utf8, `timezone` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `birthday` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `aboutMe` longtext CHARACTER SET utf8, `flavorText` text CHARACTER SET utf8, `hobbies` longtext CHARACTER SET utf8, `age` tinytext CHARACTER SET utf8, `gender` tinytext CHARACTER SET utf8, `dmFriendly` tinytext CHARACTER SET utf8, `profilePictureLink` text CHARACTER SET utf8, `favoriteGames` longtext CHARACTER SET utf8, `profileColor` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `favoriteMusic` longtext CHARACTER SET utf8, `socialLinks` longtext CHARACTER SET utf8, `zodiacName` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `fortunePoints` int(11) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		if ((await this.query("SHOW TABLES LIKE \"photogallery\"", true)).length === 0)
			await this.query("CREATE TABLE `photogallery` (`userid` tinytext CHARACTER SET utf8 NOT NULL, `links` longtext CHARACTER SET utf8 NOT NULL, `linkname` longtext CHARACTER SET utf8 NOT NULL, `tags` varchar(45) CHARACTER SET utf8 NOT NULL, `nsfw` tinytext CHARACTER SET utf8) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		if ((await this.query("SHOW TABLES LIKE \"timers\"", true)).length === 0)
			await this.query("CREATE TABLE `timers` (`id` int(11) NOT NULL AUTO_INCREMENT, `userId` tinytext COLLATE utf8mb4_bin NOT NULL, `content` text COLLATE utf8mb4_bin, `channelId` tinytext COLLATE utf8mb4_bin, `trigger` text COLLATE utf8mb4_bin, `timer` bigint(20) NOT NULL, `occurences` tinyint(4) NOT NULL, `remind` bigint(11) DEFAULT NULL, `active` tinyint(1) NOT NULL DEFAULT '1', PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		this.integrityCheck = true;
	}

	/**
	 * Performs a query to the database and returns the parsed MySQL result
	 * @param {string} query
	 */
	query(query, ignoreIntegrity = false) {
		return new Promise(async (resolve, reject) => {
			if (!this.integrityCheck && !ignoreIntegrity) await this.checkIntegrity();
			this.pool.query(query, (error, result) => {
				console.log(`# DB Query - ${query}`);
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	}

	async checkId(id) {
		try {
			await this.client.users.fetch(id);
			return true;
		} catch (errU) {
			try {
				const guild = await this.client.guilds.resolve(id);
				if (guild instanceof Guild)
					return true;
				return false;
			} catch (errG) {
				return new RangeError("The ID specified is not a string.");
			}
		}
	}

	async checkSelectOneById(id, columns) {
		const check = await this.checkId(id);
		if (check instanceof RangeError) return check;
		if (columns !== undefined && !(columns instanceof Array))
			return new RangeError("The columns property is not an Array object.");
		return true;
	}

	async checkUpdateOneById(id, changes) {
		const check = await this.checkId(id);
		if (check instanceof RangeError) return check;
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
