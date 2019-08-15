const { Client } = require("discord.js");
const fs = require("fs");
const CDBAHandler = require("../Aldebaran/CDBAHandler");
const CommandHandler = require("../categories/Handler");
const DatabasePool = require("../Aldebaran/DatabasePool.js");
const confModels = require("../../functions/checks/configurationModels");
const aldebaranTeam = require("../../config/aldebaranTeam.json");
const config = require("../../config/config.json");
const presences = require("../../config/presence.json");
const packageFile = require("../../package.json");

module.exports = class AldebaranClient extends Client {
	constructor() {
		super({
			disabledEvents: ["TYPING_START"],
			messageCacheMaxSize: 10,
			messageCacheLifetime: 1800,
			messageSweepInterval: 300
		});
		this.started = Date.now();
		this.CDBA = new CDBAHandler();
		this.commandGroups = {};
		this.config = config;
		this.config.presence = presences;
		this.config.aldebaranTeam = aldebaranTeam;
		this.commands = new CommandHandler(this);
		this.database = new DatabasePool(this);
		this.debugMode = process.argv[2] === "dev";
		this.login(this.debugMode ? this.config.tokendev : this.config.token);
		this.models = { settings: confModels };
		this.stats = {
			commands: {
				total: 0,
				all: {}
			},
			users: {
				total: 0,
				all: {}
			},
			servers: {
				total: 0,
				all: {}
			}
		};
		this.version = packageFile.version;
		if (process.argv[3] !== undefined && this.debugMode) {
			// eslint-disable-next-line prefer-destructuring
			this.config.prefix = process.argv[3];
		}
		for (const [command] of this.commands.commands)
			this.stats.commands.all[command] = {};
		for (const [key, value] of Object.entries(this.models.settings.common)) {
			this.models.settings.user[key] = value;
			this.models.settings.guild[key] = value;
		}
		if (!fs.existsSync("./cache/")) fs.mkdirSync("./cache/");

		this.databaseCounts = {
			users: new Map(),
			profiles: new Map(),
			guilds: new Map()
		};
		const usersDatabaseData = new Map();
		const profilesDatabaseData = new Map();
		const guildsDatabaseData = new Map();
		this.database.users.selectAll().then(users => {
			for (const data of users) {
				const id = data.userId;
				delete data.userId;
				usersDatabaseData.set(id, data);
			}
			this.database.socialprofile.selectAll().then(profiles => {
				for (const data of profiles) {
					const id = data.userId;
					delete data.userId;
					profilesDatabaseData.set(id, data);
				}
				this.database.guilds.selectAll().then(guilds => {
					for (const data of guilds) {
						const id = data.guildid;
						delete data.guildid;
						guildsDatabaseData.set(id, data);
					}
					this.database
						.query("SELECT COUNT(DISTINCT userId) FROM users")
						.then(usersCount => {
							this.databaseCounts.users = usersCount[0]["COUNT(DISTINCT userId)"];
							this.database
								.query("SELECT COUNT(*) FROM socialprofile")
								.then(profilesCount => {
									this.databaseCounts.profiles = profilesCount[0]["COUNT(*)"];
									this.database
										.query("SELECT COUNT(DISTINCT guildid) FROM guilds")
										.then(guildsCount => {
											this.databaseCounts.guilds = guildsCount[0]["COUNT(DISTINCT guildid)"];
											this.buildDatabaseFetch({
												counts: {
													...this.databaseCounts
												},
												data: {
													users: usersDatabaseData,
													profiles: profilesDatabaseData,
													guilds: guildsDatabaseData
												}
											});
										});
								});
						});
				});
			});
		});

		fs.readdir("./events/", (err, files) => {
			if (err) throw console.error(err);
			files.forEach(file => {
				// eslint-disable-next-line import/no-dynamic-require, global-require
				const eventFunction = require(`${process.cwd()}/events/${file}`);
				const eventName = file.split(".")[0];
				this.on(eventName, (...args) => eventFunction.run(this, ...args));
			});
		});
	}

	buildDatabaseFetch(data) {
		this.databaseFetch = data;
		console.log(`\x1b[36m# Ready. Took ${Date.now() - this.started}ms.\x1b[0m`);
	}
};
