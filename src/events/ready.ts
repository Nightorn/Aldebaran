import { formatNumber } from "../utils/Methods.js";
import DiscordClient from "../structures/DiscordClient.js";
import RevoltClient from "../structures/RevoltClient.js";
import axios from "axios";

const apiUrl = "https://api.revolt.chat/";

function replace(text: string, values: { [key: string]: string | number }) {
	return text.replace(/{([A-Z]+)}/g, (_, key) => String(values[key]));
}

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

	client.discord.user.setActivity("for a few seconds now");

	const { presence } = client.config;
	setInterval(() => {
		const { text, type } = presence[Math.floor(Math.random() * presence.length)];
		const activity = replace(text, {
			"NSERVERS": formatNumber(client.discord.guilds.cache.size),
			"NUSERS": formatNumber(client.discord.users.cache.size),
			"PREFIX": process.env.PREFIX || "&",
			"VERSION": client.version
		});

		client.discord.user.setActivity(activity, { type });
	}, 30000);
}

export async function revoltReady(client: RevoltClient) {
	updateRevoltStatus("Online!");

	const { presence } = client.config;
	setInterval(() => {
		const { text, type } = presence[Math.floor(Math.random() * presence.length)];
		const activity = replace(text, {
			"NSERVERS": formatNumber(client.revolt.servers.size),
			"NUSERS": formatNumber(client.revolt.users.size),
			"PREFIX": process.env.PREFIX || "&",
			"VERSION": client.version
		});

		updateRevoltStatus(`${activityType[type]} ${activity}`);
	}, 30000);
}
