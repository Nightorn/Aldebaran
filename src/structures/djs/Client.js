const { Client } = require("discord.js");
const fs = require("fs");
const CDBAHandler = require("../../handlers/CDBAHandler");
const CommandHandler = require("../../handlers/CommandHandler");
const DatabaseProvider = require("../../handlers/DatabaseProvider");
const confModels = require("../../utils/checks/configurationModels");
const aldebaranTeam = require("../../../config/aldebaranTeam.json");
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
		this.config = { presence: presences, aldebaranTeam };
		this.preCustomTimers = [];
		this.customTimers = new Map();
		this.customTimerTriggers = new Map();
		this.database = new DatabaseProvider(this);
		this.databaseData = { profiles: new Map() };
		this.database.timers.selectAll().then(timers => {
			timers.forEach(this.preCustomTimers.push);
			console.log(`\x1b[36m# Fetched all necessary data from database, took ${Date.now() - this.started}ms.\x1b[0m`);
			this.login(process.env.TOKEN).then(() => {
				console.log(`\x1b[36m# Everything was started, took ${Date.now() - this.started}ms.\x1b[0m`);
			});
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
			process.env.PREFIX = process.argv[3];
		}
		for (const [command] of this.commands.commands)
			this.stats.commands.all[command] = {};
		for (const [key, value] of Object.entries(this.models.settings.common)) {
			this.models.settings.user[key] = value;
			this.models.settings.guild[key] = value;
		}
		if (!fs.existsSync("./cache/")) fs.mkdirSync("./cache/");
		this.drpgCache = {};
		if (fs.existsSync("./cache/drpgCache.json")) {
			// eslint-disable-next-line global-require, import/no-unresolved
			this.drpgCache = require("../../../cache/drpgCache.json");
		}

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

	get shardID() {
		return this.guilds.cache.first().shardID;
	}
};
