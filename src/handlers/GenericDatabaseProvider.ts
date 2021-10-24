import mysql, { Pool } from "mysql2";

export default class GenericDatabaseProvider {
	integrityCheck: Boolean;
	pool: Pool;

	/**
	 * Returns a MySQL pool connection to the Aldebaran's database
	 */
	constructor() {
		if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER
			|| !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE
		) throw new TypeError("The database configuration is invalid");
		this.integrityCheck = false;
		this.pool = mysql.createPool({
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
			connectTimeout: 60000
		});
	}

	async checkIntegrity() {
		await this.query("CREATE TABLE IF NOT EXISTS `users` (`userId` varchar(20) CHARACTER SET utf8 NOT NULL, `settings` text CHARACTER SET utf8 NOT NULL, `permissions` mediumint(9) DEFAULT 0, `timeout` bigint(20) DEFAULT NULL, UNIQUE KEY `userId` (`userId`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		await this.query("CREATE TABLE IF NOT EXISTS `guilds` (`guildid` tinytext CHARACTER SET utf8, `settings` text CHARACTER SET utf8, `commands` text COLLATE utf8mb4_bin NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		await this.query("CREATE TABLE IF NOT EXISTS `socialprofile` (`userId` tinytext CHARACTER SET utf8, `name` text CHARACTER SET utf8, `country` text CHARACTER SET utf8, `timezone` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `birthday` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `aboutMe` longtext CHARACTER SET utf8, `flavorText` text CHARACTER SET utf8, `hobbies` longtext CHARACTER SET utf8, `age` tinytext CHARACTER SET utf8, `gender` tinytext CHARACTER SET utf8, `dmFriendly` tinytext CHARACTER SET utf8, `profilePictureLink` text CHARACTER SET utf8, `favoriteGames` longtext CHARACTER SET utf8, `profileColor` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `favoriteMusic` longtext CHARACTER SET utf8, `socialLinks` longtext CHARACTER SET utf8, `zodiacName` varchar(45) CHARACTER SET utf8 DEFAULT NULL, `fortunePoints` int(11) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;", true);
		await this.query("CREATE TABLE IF NOT EXISTS `api_clients` (`client_id` varchar(50) NOT NULL, `name` tinytext NOT NULL, `avatar` text, `client_secret` tinytext NOT NULL, `redirect_uris` text NOT NULL, UNIQUE KEY `client_id` (`client_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1", true);
		await this.query("CREATE TABLE IF NOT EXISTS `api_authcodes` (`id` int(11) NOT NULL AUTO_INCREMENT, `code` tinytext NOT NULL, `expires_at` bigint(20) NOT NULL, `redirect_uri` text NOT NULL, `scope` text NOT NULL, `client_id` tinytext NOT NULL, `user_id` tinytext NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1", true);
		await this.query("CREATE TABLE IF NOT EXISTS `api_tokens` (`id` int(11) NOT NULL AUTO_INCREMENT, `access_token` tinytext NOT NULL, `acctok_expires_at` bigint(20) NOT NULL, `refresh_token` tinytext NOT NULL, `reftok_expires_at` bigint(20) NOT NULL, `scope` text NOT NULL, `client_id` tinytext NOT NULL, `user_id` tinytext NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1", true);
		await this.query("CREATE TABLE IF NOT EXISTS `glow_sessions` (`id` int(11) NOT NULL AUTO_INCREMENT, `user` tinytext NOT NULL, `session` tinytext NOT NULL, `access_token` tinytext NOT NULL, `refresh_token` tinytext NOT NULL, `expires` bigint(20) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1", true);
		this.integrityCheck = true;
	}

	/**
	 * Performs a query to the database and returns the parsed MySQL result
	 */
	query(query: string, ignoreIntegrity = false): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (!this.integrityCheck && !ignoreIntegrity) await this.checkIntegrity();
			this.pool.query(query, (error, result) => {
				console.log(`# DB Query - ${query}`);
				if (error) {
					reject(error);
					console.error(error);
				} else {
					resolve(result);
				}
			});
		});
	}
}
