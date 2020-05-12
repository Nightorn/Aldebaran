require("dotenv").config();
const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./bot.js", { token: process.env.TOKEN, shardArgs: process.argv.slice(2, 4) });

manager.on("shardCreate", shard => console.log(`! Launched shard ${shard.id}`));
manager.spawn(Number(process.env.SHARDS), 1, 60000);
