/* eslint-disable */

const { exec } = require("child_process");

console.log("\x1b[34m1. Installing NPM packages...\x1b[0m");
exec("npm install --only=dev", (err, stdout, stderr) => {
	if (err) {
		throw err;
	} else {
		console.log(stdout);
		console.log(stderr);

		const mysqlDB = {
			port: 3306
		};
		console.log("\x1b[34m2. Configuring the MySQL database...\x1b[0m");
		const readline = require("readline-sync");
		mysqlDB.host = readline.question(" - Where is your DB located? Type the IP or the URL.\n >   ");
		mysqlDB.user = readline.question(" - What is the name of the database user?\n >   ");
		mysqlDB.password = readline.question(` - What is the password of ${mysqlDB.user}?\n >   `);
		mysqlDB.database = readline.question(" - What is the name of the database?\n >   ");
		console.log(" Please wait, we are configuring your database... If the informations you entered are correct, you should not receive any error.");
		const mysql = require("mysql");
		const connection = mysql.createConnection(mysqlDB);
		connection.connect(connectionError => {
			if (connectionError) throw connectionError;
			else {
				const promises = [
					connection.query("CREATE TABLE `commands` (\n  `command` tinytext CHARACTER SET latin1 NOT NULL,\n  `subCommand` tinytext CHARACTER SET latin1,\n  `userId` tinytext CHARACTER SET latin1 NOT NULL,\n  `channelId` tinytext CHARACTER SET latin1 NOT NULL,\n  `guildId` tinytext CHARACTER SET latin1 NOT NULL,\n  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `args` text CHARACTER SET latin1\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin"),
					connection.query("CREATE TABLE `guilds` (\n  `guildid` tinytext CHARACTER SET utf8,\n  `settings` text CHARACTER SET utf8,\n  `commands` text COLLATE utf8mb4_bin NOT NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin"),
					connection.query("CREATE TABLE `users` (\n  `userId` varchar(20) CHARACTER SET utf8 NOT NULL,\n  `settings` text CHARACTER SET utf8 NOT NULL,\n  `timeout` bigint(20) DEFAULT NULL,\n  UNIQUE KEY `userId` (`userId`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin"),
					connection.query("CREATE TABLE `socialprofile` (\n  `userId` tinytext CHARACTER SET utf8,\n  `name` text CHARACTER SET utf8,\n  `country` text CHARACTER SET utf8,\n  `timezone` varchar(45) CHARACTER SET utf8 DEFAULT NULL,\n  `birthday` varchar(45) CHARACTER SET utf8 DEFAULT NULL,\n  `aboutMe` longtext CHARACTER SET utf8,\n  `flavorText` text CHARACTER SET utf8,\n  `hobbies` longtext CHARACTER SET utf8,\n  `age` tinytext CHARACTER SET utf8,\n  `gender` tinytext CHARACTER SET utf8,\n  `dmFriendly` tinytext CHARACTER SET utf8,\n  `profilePictureLink` text CHARACTER SET utf8,\n  `favoriteGames` longtext CHARACTER SET utf8,\n  `profileColor` varchar(45) CHARACTER SET utf8 DEFAULT NULL,\n  `favoriteMusic` longtext CHARACTER SET utf8,\n  `socialLinks` longtext CHARACTER SET utf8,\n  `zodiacName` varchar(45) CHARACTER SET utf8 DEFAULT NULL,\n  `fortunePoints` int(11) DEFAULT NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin")
				];
				Promise.all(promises).then(() => {
					console.log("\x1b[34m3. Configuring the bot's authentication informations...\x1b[0m");
					const token = readline.question(" - What is the bot's token?\n >   ");
					const owner = readline.question(" - Who are you? What is your Discord user ID?\n >   ");
					const fs = require("fs");
					fs.writeFileSync("config/config.json", JSON.stringify({
						token,
						tokendev: null,
						prefix: "&",
						generalCooldown: 2000,
						drpg_apikey: null,
						giphy_apikey: null,
						omdb_apikey: null,
						cat_apikey: null,
						mysql: {
							connectionLimit: 80,
							port: 3306,
							...mysqlDB
						},
						pexels_apikey: null,
						admins: [
							owner
						],
						apikeys: {
							"osu!": null,
							yandex_translate: null,
							fixer: null
						}
					}, null, 4));
					console.log("\x1b[34mDONE! You should be able to run Aldebaran with 'npm start'.");
					process.exit(1);
				}).catch(err => {
					throw err;
				});
			}
		});
	}
});
