const mysql = require("mysql");

module.exports = class GenericDatabaseProvider {
	/**
	 * Returns a MySQL pool connection to the Aldebaran's database
	 */
	constructor() {
		if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER
			|| !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE
		) throw new TypeError("The database configuration is invalid");
		this.pool = mysql.createPool({
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
			connectTimeout: 60000,
			acquireTimeout: 60000,
			timeout: 60000
		});
	}

	async checkIntegrity() {
		if ((await this.query("SHOW TABLES LIKE \"users\"", true)).length === 0)
			await this.query("CREATE TABLE `users` (`userId` varchar(20) CHARACTER SET utf8 NOT NULL, `settings` text CHARACTER SET utf8 NOT NULL, `permissions` mediumint(9) DEFAULT 0, `timeout` bigint(20) DEFAULT NULL, UNIQUE KEY `userId` (`userId`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		if ((await this.query("SHOW TABLES LIKE \"guilds\"", true)).length === 0)
			await this.query("CREATE TABLE `guilds` (`guildid` tinytext CHARACTER SET utf8, `settings` text CHARACTER SET utf8, `commands` text COLLATE utf8mb4_bin NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		if ((await this.query("SHOW TABLES LIKE \"socialprofile\"", true)).length === 0)
			await this.query("CREATE TABLE `socialprofile` (`userId` tinytext CHARACTER SET utf8, `name` text CHARACTER SET utf8, `country` text CHARACTER SET utf8, `timezone` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `birthday` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `aboutMe` longtext CHARACTER SET utf8, `flavorText` text CHARACTER SET utf8, `hobbies` longtext CHARACTER SET utf8, `age` tinytext CHARACTER SET utf8, `gender` tinytext CHARACTER SET utf8, `dmFriendly` tinytext CHARACTER SET utf8, `profilePictureLink` text CHARACTER SET utf8, `favoriteGames` longtext CHARACTER SET utf8, `profileColor` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `favoriteMusic` longtext CHARACTER SET utf8, `socialLinks` longtext CHARACTER SET utf8, `zodiacName` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `fortunePoints` int(11) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		if ((await this.query("SHOW TABLES LIKE \"photogallery\"", true)).length === 0)
			await this.query("CREATE TABLE `photogallery` (`userid` tinytext CHARACTER SET utf8 NOT NULL, `links` longtext CHARACTER SET utf8 NOT NULL, `linkname` longtext CHARACTER SET utf8 NOT NULL, `tags` varchar(45) CHARACTER SET utf8 NOT NULL, `nsfw` tinytext CHARACTER SET utf8) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		if ((await this.query("SHOW TABLES LIKE \"timers\"", true)).length === 0)
			await this.query("CREATE TABLE `timers` (`id` int(11) NOT NULL AUTO_INCREMENT, `userId` tinytext COLLATE utf8mb4_bin NOT NULL, `content` text COLLATE utf8mb4_bin, `channelId` tinytext COLLATE utf8mb4_bin, `trigger` text COLLATE utf8mb4_bin, `timer` bigint(20) NOT NULL, `occurences` tinyint(4) NOT NULL, `remind` bigint(11) DEFAULT NULL, `active` tinyint(1) NOT NULL DEFAULT '1', PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		if ((await this.query("SHOW TABLES LIKE \"api_clients\"", true)).length === 0)
			await this.query("CREATE TABLE `api_clients` (`client_id` varchar(50) NOT NULL, `name` tinytext NOT NULL, `avatar` text, `client_secret` tinytext NOT NULL, `redirect_uris` text NOT NULL, UNIQUE KEY `client_id` (`client_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1", true);
		if ((await this.query("SHOW TABLES LIKE \"api_authcodes\"", true)).length === 0)
			await this.query("CREATE TABLE `api_authcodes` (`id` int(11) NOT NULL AUTO_INCREMENT, `code` tinytext NOT NULL, `expires_at` bigint(20) NOT NULL, `redirect_uri` text NOT NULL, `scope` text NOT NULL, `client_id` tinytext NOT NULL, `user_id` tinytext NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1", true);
		if ((await this.query("SHOW TABLES LIKE \"api_tokens\"", true)).length === 0)
			await this.query("CREATE TABLE `api_tokens` (`id` int(11) NOT NULL AUTO_INCREMENT, `access_token` tinytext NOT NULL, `acctok_expires_at` bigint(20) NOT NULL, `refresh_token` tinytext NOT NULL, `reftok_expires_at` bigint(20) NOT NULL, `scope` text NOT NULL, `client_id` tinytext NOT NULL, `user_id` tinytext NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1", true);
		if ((await this.query("SHOW TABLES LIKE \"glow_sessions\"", true)).length === 0)
			await this.query("CREATE TABLE `glow_sessions` (`id` int(11) NOT NULL AUTO_INCREMENT, `user` tinytext NOT NULL, `session` tinytext NOT NULL, `access_token` tinytext NOT NULL, `refresh_token` tinytext NOT NULL, `expires` bigint(20) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1", true);
		this.integrityCheck = true;
	}

	/**
	 * Performs a query to the database and returns the parsed MySQL result
	 * @param {string} query The query to make to the database
     * @returns {Promise<[]>}
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
};
