import dotenv from "dotenv";
import { Shard, ShardingManager } from "discord.js";

dotenv.config({ path: "./.env" });

if (process.env.DISCORD_TOKEN && process.env.DISCORD_SHARDS) {
	const manager = new ShardingManager("./src/bot.ts", {
		token: process.env.DISCORD_TOKEN,
		shardArgs: process.argv.slice(2, 4),
		execArgv: ["--loader", process.argv.includes("dev") ? "ts-node/esm" : "ts-node/esm/transpile-only"]
	});
	manager.on("shardCreate", (shard: Shard) => console.log(`! Launched shard ${shard.id}`));
	manager.spawn({
		amount: Number(process.env.DISCORD_SHARDS),
		delay: 1,
		timeout: 600000
	});
}
