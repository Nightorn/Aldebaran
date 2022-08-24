import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client as DjsClient, Partials } from "discord.js";
import interactionCreate from "../events/interactionCreate.js";
import messageUpdate from "../events/messageUpdate.js";
import { discordMessage } from "../events/message.js";
import ready from "../events/ready.js";
import Client from "./Client.js";
import DiscordServerManager from "./models/managers/DiscordServerManager.js";
import DiscordUserManager from "./models/managers/DiscordUserManager.js";

const discordToken = process.env.DISCORD_TOKEN;

export default class DiscordClient extends Client {
	discord: DjsClient<true>;
	id?: string = process.env.DISCORD_CLIENT_ID;
	servers = new DiscordServerManager(this);
	users = new DiscordUserManager(this);

	constructor() {
		super();

		this.discord = new DjsClient({
			intents: [
				"DirectMessages",
				"DirectMessageReactions",
				"GuildEmojisAndStickers",
				"Guilds",
				"GuildMessages",
				"GuildMessageReactions",
				"GuildWebhooks"
			],
			partials: [Partials.Channel]
		});

		if (process.env.DEPLOY_SLASH && this.id && discordToken) {
			const rest = new REST({ version: "10" }).setToken(discordToken);
			const body = this.commands.slashCommands.map(c => c.toJSON()); 
			rest.put(Routes.applicationCommands(this.id), { body })
				.then(() => console.log("Slash commands registered"))
				.catch(console.error);
		}

		this.discord.on("interactionCreate", int => interactionCreate(this, int));
		this.discord.on("messageCreate", msg => discordMessage(this, msg));
		this.discord.on("messageUpdate", msg => messageUpdate(this, msg));
		this.discord.on("ready", () => ready(this));
		this.discord.login()
			.then(() => console.log(`\x1b[36m# Discord Client is logged in.\x1b[0m`));
	}
}
