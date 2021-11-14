import { Client } from "discord.js";
import fs from "fs";
import NekosClient from "nekos.life";
import { Client as NodesuClient } from "nodesu";
import CommandHandler from "../../handlers/CommandHandler.js";
import importCommands from "../../commands/commands.js";
import DatabaseProvider from "../../handlers/DatabaseProvider.js";
import message from "../../events/message.js";
import ready from "../../events/ready.js";
import { aldebaranTeam, packageFile, presences, SettingsModel } from "../../utils/Constants.js";
import { Guild, User } from "../../commands/drpg/glead.js";
import CustomGuildManager from "../aldebaran/CustomGuildManager.js";
import CustomProfileManager from "../aldebaran/CustomProfileManager.js";
import CustomUserManager from "../aldebaran/CustomUserManager.js";

export default class AldebaranClient extends Client<true> {
	commands = CommandHandler.getInstance(this);
	config = { presence: presences, aldebaranTeam };
	customGuilds = new CustomGuildManager(this);
	customProfiles = new CustomProfileManager(this);
	customUsers = new CustomUserManager(this);
	debugMode = process.argv[2] === "dev";
	drpgCache: { [key: string]: User | Guild } = {};
	database = new DatabaseProvider(this);
	databaseData = { profiles: new Map() };
	models = { settings: SettingsModel };
	name = process.env.NAME || "Aldebaran";
	nekoslife = new NekosClient();
	nodesu?: NodesuClient;
	started = Date.now();
	version = process.env.VERSION || packageFile.version;

	constructor() {
		super({
			intents: [
				"DIRECT_MESSAGES",
				"DIRECT_MESSAGE_REACTIONS",
				"GUILD_EMOJIS_AND_STICKERS",
				"GUILDS",
				"GUILD_MESSAGES",
				"GUILD_MESSAGE_REACTIONS",
				"GUILD_WEBHOOKS"
			],
			partials: ["CHANNEL"]
		});

		if (process.env.API_OSU) {
			this.nodesu = new NodesuClient(process.env.API_OSU);
		}

		importCommands();
		if (process.argv[3] !== undefined && this.debugMode) {
			process.env.PREFIX = process.argv[3];
		}

		if (!fs.existsSync("./cache/")) fs.mkdirSync("./cache/");
		if (fs.existsSync("./cache/drpgCache.json")) {
			this.drpgCache = JSON.parse(fs.readFileSync("./cache/drpgCache.json").toString());
		}

		this.on("messageCreate", msg => message(this, msg));
		this.on("ready", () => ready(this));

		this.login(process.env.TOKEN).then(() => {
			console.log(`\x1b[36m# Everything was started, took ${Date.now() - this.started}ms.\x1b[0m`);
		});
	}

	get shardId() {
		return this.guilds.cache.first()!.shardId;
	}
};
