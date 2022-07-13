import { formatNumber } from "../utils/Methods.js";
import Client from "../structures/Client.js";

export default (client: Client) => {
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
};
