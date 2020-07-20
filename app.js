const { ShardingManager } = require("discord.js");
const api = require("./src/api/api");

require("dotenv").config();

if (process.argv.includes("--api")) {
	api();
} else {
	const manager = new ShardingManager("./bot.js", { token: process.env.TOKEN, shardArgs: process.argv.slice(2, 4) });
	api(manager);
	manager.on("shardCreate", shard => console.log(`! Launched shard ${shard.id}`));
	manager.spawn(Number(process.env.SHARDS), 1, 60000);
}
