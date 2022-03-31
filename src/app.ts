import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { Shard, ShardingManager } from "discord.js";
import api from "./api/api.js";

const manager = new ShardingManager("./src/bot.ts", {
	token: process.env.TOKEN,
	shardArgs: process.argv.slice(2, 4),
	execArgv: ["--loader", process.argv.includes("dev") ? "ts-node/esm" : "ts-node/esm/transpile-only"]
});
api(manager);
manager.on("shardCreate", (shard: Shard) => console.log(`! Launched shard ${shard.id}`));
manager.spawn({
	amount: Number(process.env.SHARDS),
	delay: 1,
	timeout: 600000
});
