const { ShardingManager } = require("discord.js");
const config = require("./config/config.json");

const manager = new ShardingManager("./bot.js", { token: config.tokendev, shardArgs: process.argv.slice(2, 4) });

manager.spawn(config.shards, 1, 60000);
manager.on("shardCreate", shard => console.log(`! Launched shard ${shard.id}`));
