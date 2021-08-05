import { Client } from "discord.js";
import fs from "fs";
import CommandHandler from "../../handlers/CommandHandler.js";
import importCommands from "../../commands/commands.js";
import DatabaseProvider from "../../handlers/DatabaseProvider.js";
import { SettingsModel } from "../../utils/Constants.js";
import message from "../../events/message.js";
import ready from "../../events/ready.js";
import Message from "./Message.js";

const aldebaranTeam: { [key: string]: { titles: string[], acknowledgements: string[], staffRank: number, text: string } }
	= JSON.parse(fs.readFileSync("./config/aldebaranTeam.json").toString());
const presences = JSON.parse(fs.readFileSync("./config/presence.json").toString());
const packageFile = JSON.parse(fs.readFileSync("./package.json").toString());

export default class AldebaranClient extends Client {
	started: number = Date.now();
	config: { presence: any, aldebaranTeam: typeof aldebaranTeam } = { presence: presences, aldebaranTeam };
	database: DatabaseProvider = new DatabaseProvider(this);
	databaseData: object = { profiles: new Map() };
	commandGroups: any = {};
	commands: CommandHandler = CommandHandler.getInstance(this);
	debugMode: boolean = process.argv[2] === "dev";
	models: any = { settings: SettingsModel };
	stats: any;
	version: string = packageFile.version;
	drpgCache: any = {};

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

		importCommands();
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
		if (fs.existsSync("./cache/drpgCache.json")) {
			this.drpgCache = JSON.parse(fs.readFileSync("./cache/drpgCache.json").toString());
		}

		this.on("message", msg => message(this, msg as Message));
		this.on("ready", () => ready(this));

		this.login(process.env.TOKEN).then(() => {
			console.log(`\x1b[36m# Everything was started, took ${Date.now() - this.started}ms.\x1b[0m`);
		});
	}

	get shardID() {
		return this.guilds.cache.first()!.shardID;
	}
};
