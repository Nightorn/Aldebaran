import { Client } from "discord.js";
import fs from "fs";
import CDBAHandler from "../../handlers/CDBAHandler";
import CommandHandler from "../../handlers/CommandHandler";
import DatabaseProvider from "../../handlers/DatabaseProvider";
import confModels from "../../utils/checks/configurationModels";
import aldebaranTeam from "../../../config/aldebaranTeam.json";
import presences from "../../../config/presence.json";
import packageFile from "../../../package.json";
import CustomTimer from "../aldebaran/CustomTimer";

export default class AldebaranClient extends Client {
	started: number = Date.now();
	config: object = { presence: presences, aldebaranTeam };
	preCustomTimers: any[] = [];
	customTimers: Map<any, any> = new Map<number, CustomTimer>();
	customTimerTriggers: Map<any, any> = new Map();
	database: DatabaseProvider = new DatabaseProvider(this);
	databaseData: object = { profiles: new Map() };
	CDBA: CDBAHandler = new CDBAHandler();
	commandGroups: object = {};
	commands: CommandHandler = new CommandHandler(this);
	debugMode: boolean = process.argv[2] === "dev";
	models: any = { settings: confModels };
	stats: any;
	version: string = packageFile.version;
	drpgCache: object;

	constructor() {
		super({
			messageCacheMaxSize: 10,
			messageCacheLifetime: 1800,
			messageSweepInterval: 60
		});
		this.database.timers.selectAll().then((timers: any) => {
			timers.forEach(this.preCustomTimers.push);
			console.log(`\x1b[36m# Fetched all necessary data from database, took ${Date.now() - this.started}ms.\x1b[0m`);
			this.login(process.env.TOKEN).then(() => {
				console.log(`\x1b[36m# Everything was started, took ${Date.now() - this.started}ms.\x1b[0m`);
			});
		});
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
			if (err) throw err;
			files.forEach(file => {
				// eslint-disable-next-line import/no-dynamic-require, global-require
				const eventFunction = require(`../../events/${file}`);
				const eventName = file.split(".")[0];
				this.on(eventName, (...args) => eventFunction.run(this, ...args));
			});
		});
	}

	get shardID() {
		return this.guilds.cache.first()!.shardID;
	}
};
