import { Client as DiscordClient } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import fs from "fs";
import NekosClient from "nekos.life";
import { Client as NodesuClient } from "nodesu";
import CommandHandler from "../handlers/CommandHandler.js";
import importCommands from "../commands/commands.js";
import DatabaseProvider from "../handlers/DatabaseProvider.js";
import interactionCreate from "../events/interactionCreate.js";
import message from "../events/message.js";
import ready from "../events/ready.js";
import { aldebaranTeam, packageFile, presences, SettingsModel } from "../utils/Constants.js";
import { Guild, User } from "../commands/drpg/glead.js";
import ServerManager from "./models/managers/ServerManager.js";
import UserManager from "./models/managers/UserManager.js";
import "./models/models.js";

export default class Client {
	commands = CommandHandler.getInstance(this);
	config = { presence: presences, aldebaranTeam };
	debugMode = process.argv[2] === "dev";
	discord: DiscordClient;
	drpgCache: { [key: string]: User | Guild } = {};
	databaseData = { profiles: new Map() };
	guilds = new ServerManager(this);
	id: string = process.env.DISCORD_CLIENT_ID!;
	models = { settings: SettingsModel };
	name = process.env.NAME || "Aldebaran";
	nekoslife = new NekosClient();
	nodesu?: NodesuClient;
	started = Date.now();
	users = new UserManager(this);
	version = process.env.VERSION || packageFile.version;

	constructor() {
		this.discord = new DiscordClient({
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
		if (process.argv[3] !== undefined && process.argv[2] === "dev") {
			process.env.PREFIX = process.argv[3];
		}

		if (!fs.existsSync("./cache/")) fs.mkdirSync("./cache/");
		if (fs.existsSync("./cache/drpgCache.json")) {
			this.drpgCache = JSON.parse(fs.readFileSync("./cache/drpgCache.json").toString());
		}

		this.discord.on("interactionCreate", int => interactionCreate(this, int));
		this.discord.on("messageCreate", msg => message(this, msg));
		this.discord.on("ready", () => ready(this));

		if (process.env.DEPLOY_SLASH) {
			const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);
			const body = this.commands.slashCommands.map(c => c.toJSON()); 
			rest.put(Routes.applicationCommands(this.id), { body })
				.then(() => console.log("Slash commands registered"))
				.catch(console.error);
		}
	
		Promise.all([
			this.discord.login(),
			DatabaseProvider.authenticate()
		]).then(() => {
			console.log(`\x1b[36m# Everything was started, took ${Date.now() - this.started}ms.\x1b[0m`);
		});
	}

	get shardId() {
		return this.discord.guilds.cache.first()!.shardId;
	}
}
