import { formatNumber } from "../utils/Methods.js";
import DiscordClient from "../structures/DiscordClient.js";
import RevoltClient from "../structures/RevoltClient.js";
import axios from "axios";

const apiUrl = "https://api.revolt.chat/";

async function updateRevoltStatus(text: string) {
	await axios.patch(`${apiUrl}/users/@me`,
		{ status: { text, presence: "Online" } },
		{ headers: { "x-bot-token": process.env.REVOLT_TOKEN as string } }
	);
}

const activityType = {
	0: "Playing",
	1: "Streaming",
	2: "Listening",
	3: "Watching"
}

export async function discordReady(client: DiscordClient) {
	const devMode = process.argv[2] === "dev"
		? " The developer mode has been enabled." : "";
	console.log(
		`\x1b[36m# ${client.discord.user.username} has started!${devMode}\x1b[0m`
	);

	const users = client.discord.users.cache.size;
	const channels = client.discord.channels.cache.size;
	const guilds = client.discord.guilds.cache.size;
	console.log(
		`\x1b[36m# ${users} users, ${channels} channels, ${guilds} servers\x1b[0m`
	);

	const parseText = (value: string) => {
		let text = value;
		text = text.replace("{NSERVERS}", formatNumber(guilds))
			.replace("{NUSERS}", formatNumber(users))
			.replace("{VERSION}", client.version)
			.replace("{PREFIX}", process.env.PREFIX || "&");
		return text;
	};

	client.discord.user.setActivity("for a few seconds now");

	const { presence } = client.config;
	setInterval(() => {
		const { text, type } = presence[Math.floor(Math.random() * presence.length)];
		client.discord.user.setActivity(parseText(text), { type });
	}, 30000);
}

export async function revoltReady(client: RevoltClient) {
	const users = client.revolt.users.size;
	const servers = client.revolt.servers.size;

	const parseText = (value: string) => {
		let text = value;
		text = text.replace("{NSERVERS}", formatNumber(servers))
			.replace("{NUSERS}", formatNumber(users))
			.replace("{VERSION}", client.version)
			.replace("{PREFIX}", process.env.PREFIX || "&");
		return text;
	};

	updateRevoltStatus("Online!");

	const { presence } = client.config;
	setInterval(() => {
		const { text, type } = presence[Math.floor(Math.random() * presence.length)];
		updateRevoltStatus(`${activityType[type]} ${parseText(text)}`);
	}, 30000);
}
