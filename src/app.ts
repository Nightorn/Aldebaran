import { Shard, ShardingManager } from "discord.js";
import dotenv from "dotenv";
import api from "./api/api.js";

dotenv.config({ path: "./.env" });

const manager = new ShardingManager("./src/bot.ts", {
	token: process.env.TOKEN,
	shardArgs: process.argv.slice(2, 4),
	execArgv: ["--loader", "ts-node/esm/transpile-only"]
});
api(manager);
manager.on("shardCreate", (shard: Shard) => console.log(`! Launched shard ${shard.id}`));
manager.spawn({
	amount: Number(process.env.SHARDS),
	delay: 1,
	timeout: 600000
});
