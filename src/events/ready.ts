import { formatNumber } from "../utils/Methods.js";
import AldebaranClient from "../structures/djs/Client.js";

export default (client: AldebaranClient) => {
	console.log(
		`\x1b[36m# ${client.user!.username} has started!${
			client.debugMode ? " The developer mode has been enabled." : ""
		}\x1b[0m`
	);
	console.log(
		`\x1b[36m# ${client.users.cache.size} users, ${client.channels.cache.size} channels, ${
			client.guilds.cache.size
		} servers\x1b[0m`
	);

	const parseText = (value: string) => {
		let text = value;
		text = text.replace("{NSERVERS}", formatNumber(client.guilds.cache.size))
			.replace("{NUSERS}", formatNumber(client.users.cache.size))
			.replace("{VERSION}", client.version)
			.replace("{PREFIX}", process.env.PREFIX || "&");
		return text;
	};

	client.user!.setActivity("for a few seconds now");
	const { presence } = client.config;
	setInterval(() => {
		const selected = presence[Math.floor(Math.random() * presence.length)];
		client.user!.setActivity(parseText(selected.text), { type: selected.type });
	}, 30000);
};
