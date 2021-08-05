/// <reference path="./global.d.ts" />
import { Shard, ShardingManager } from "discord.js";
import dotenv from "dotenv";
import api from "./api/api.js";

dotenv.config({ path: "./.env" });

if (process.argv.includes("--api")) {
	api();
} else {
	const manager = new ShardingManager("./src/bot.ts", {
		token: process.env.TOKEN,
		shardArgs: process.argv.slice(2, 4),
		execArgv: ['--loader', 'ts-node/esm']
	});
	api(manager);
	manager.on("shardCreate", (shard: Shard) => console.log(`! Launched shard ${shard.id}`));
	manager.spawn(Number(process.env.SHARDS), 1, 60000);
}
