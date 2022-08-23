import fs from "fs";
import NekosClient from "nekos.life";
import { Client as NodesuClient } from "nodesu";
import CommandHandler from "../handlers/CommandHandler.js";
import importCommands from "../commands/commands.js";
import DatabaseProvider from "../handlers/DatabaseProvider.js";
import { aldebaranTeam, packageFile, presences, SettingsModel } from "../utils/Constants.js";
import { Guild, User } from "../commands/drpg/glead.js";
import ServerManager from "./models/managers/ServerManager.js";
import UserManager from "./models/managers/UserManager.js";
import "./models/models.js";

export default class Client {
	commands = CommandHandler.getInstance(this);
	config = { presence: presences, aldebaranTeam };
	debugMode = process.argv[2] === "dev";
	drpgCache: { [key: string]: User | Guild } = {};
	databaseData = { profiles: new Map() };
	models = { settings: SettingsModel };
	name = process.env.NAME || "Aldebaran";
	nekoslife = new NekosClient();
	nodesu?: NodesuClient;
	servers = new ServerManager();
	users = new UserManager();
	version = process.env.VERSION || packageFile.version;

	constructor() {
		if (process.env.API_OSU) {
			this.nodesu = new NodesuClient(process.env.API_OSU);
		}

		importCommands();
		if (process.argv[3] !== undefined && process.argv[2] === "dev") {
			process.env.PREFIX = process.argv[3];
		}

		if (!fs.existsSync("./cache/")) fs.mkdirSync("./cache/");
		if (fs.existsSync("./cache/drpgCache.json")) {
			this.drpgCache = JSON.parse(fs.readFileSync("./cache/drpgCache.json").toString());
		}

		DatabaseProvider.authenticate()
			.then(() => console.log(`\x1b[36m# Database is online.\x1b[0m`));
	}
}
