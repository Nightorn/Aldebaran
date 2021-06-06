import { Client } from "discord.js";
import fs from "fs";
import CDBAHandler from "../../handlers/CDBAHandler";
import CommandHandler from "../../handlers/CommandHandler";
import DatabaseProvider from "../../handlers/DatabaseProvider";
import { SettingsModel } from "../../utils/Constants";
import aldebaranTeam from "../../../config/aldebaranTeam.json";
import presences from "../../../config/presence.json";
import packageFile from "../../../package.json";

export default class AldebaranClient extends Client {
	started: number = Date.now();
	config: object = { presence: presences, aldebaranTeam };
	database: DatabaseProvider = new DatabaseProvider(this);
	databaseData: object = { profiles: new Map() };
	CDBA: CDBAHandler = new CDBAHandler();
	commandGroups: object = {};
	commands: CommandHandler = new CommandHandler(this);
	debugMode: boolean = process.argv[2] === "dev";
	models: any = { settings: SettingsModel };
	stats: any;
	version: string = packageFile.version;
	drpgCache: object;

	constructor() {
		super({
			messageCacheMaxSize: 10,
			messageCacheLifetime: 1800,
			messageSweepInterval: 60
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
