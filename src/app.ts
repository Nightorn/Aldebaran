import { Shard, ShardingManager } from "discord.js";
import RevoltClient from "./structures/RevoltClient.js";

const discordOnly = process.argv.includes("--discord");
const revoltOnly = process.argv.includes("--revolt");
const discord = discordOnly || !revoltOnly;
const revolt = revoltOnly || !discordOnly;

if (process.env.REVOLT_TOKEN && revolt) {
	new RevoltClient();
}

if (process.env.DISCORD_TOKEN && process.env.DISCORD_SHARDS && discord) {
	const manager = new ShardingManager("dist/src/bot.js", {
		token: process.env.DISCORD_TOKEN,
		shardArgs: process.argv.slice(2, 4)
	});
	manager.on("shardCreate", (shard: Shard) => console.log(`! Launched shard ${shard.id}`));
	manager.spawn({
		amount: Number(process.env.DISCORD_SHARDS),
		delay: 1,
		timeout: 600000
	});
}
