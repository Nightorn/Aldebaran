const { Client } = require("discord.js");
const fs = require("fs");
const CDBAHandler = require("../../handlers/CDBAHandler");
const CommandHandler = require("../../handlers/CommandHandler");
const DatabaseProvider = require("../../handlers/DatabaseProvider");
const confModels = require("../../utils/checks/configurationModels");
const aldebaranTeam = require("../../../config/aldebaranTeam.json");
const config = require("../../../config/config.json");
const presences = require("../../../config/presence.json");
const packageFile = require("../../../package.json");

module.exports = class AldebaranClient extends Client {
	constructor() {
		super({
			disabledEvents: ["TYPING_START"],
			messageCacheMaxSize: 10,
			messageCacheLifetime: 1800,
			messageSweepInterval: 60
		});
		this.started = Date.now();
		this.config = config;
		this.config.presence = presences;
		this.config.aldebaranTeam = aldebaranTeam;
		this.preCustomTimers = [];
		this.customTimers = new Map();
		this.customTimerTriggers = new Map();
		this.database = new DatabaseProvider(this);
		this.databaseData = {
			users: new Map(),
			profiles: new Map(),
			guilds: new Map()
		};
		Promise.all([
			this.database.users.selectAll(),
			this.database.guilds.selectAll(),
			this.database.socialprofile.selectAll(),
			this.database.timers.selectAll()
		]).then(([users, guilds, profiles, timers]) => {
			for (const data of users) {
				const id = data.userId;
				delete data.userId;
				this.databaseData.users.set(id, data);
			}
			for (const data of guilds) {
				const id = data.guildid;
				delete data.guildid;
				this.databaseData.guilds.set(id, data);
			}
			for (const data of profiles) {
				const id = data.userId;
				delete data.userId;
				this.databaseData.profiles.set(id, data);
			}
			for (const element of timers) {
				this.preCustomTimers.push(element);
			}
			console.log(`\x1b[36m# Fetched all necessary data from database, took ${Date.now() - this.started}ms.\x1b[0m`);
			this.login(this.debugMode ? this.config.tokendev : this.config.token)
				.then(() => {
					console.log(`\x1b[36m# Everything was started, took ${Date.now() - this.started}ms.\x1b[0m`);
				});
		}).catch(err => {
			throw err;
		});
		this.CDBA = new CDBAHandler();
		this.commandGroups = {};
		this.commands = new CommandHandler(this);
		this.debugMode = process.argv[2] === "dev";
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
			this.config.prefix = process.argv[3];
		}
		for (const [command] of this.commands.commands)
			this.stats.commands.all[command] = {};
		for (const [key, value] of Object.entries(this.models.settings.common)) {
			this.models.settings.user[key] = value;
			this.models.settings.guild[key] = value;
		}
		if (!fs.existsSync("./cache/")) fs.mkdirSync("./cache/");

		fs.readdir("./src/events/", (err, files) => {
			if (err) throw console.error(err);
			files.forEach(file => {
				// eslint-disable-next-line import/no-dynamic-require, global-require
				const eventFunction = require(`../../events/${file}`);
				const eventName = file.split(".")[0];
				this.on(eventName, (...args) => eventFunction.run(this, ...args));
			});
		});
	}
};
