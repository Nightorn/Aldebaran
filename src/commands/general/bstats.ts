import { MessageEmbed } from "discord.js";
import os from "os";
import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
import { formatNumber, getTimeString } from "../../utils/Methods.js";

export default class BStats extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays the bot usage statistics since the last start"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message) {
		const processMemory = process.memoryUsage().heapTotal;
		const mem = Math.round((100 * processMemory) / 1048576) / 100;
		const memTTL = Math.round(100 * (mem + os.freemem() / 1048576)) / 100;
		const memPRC = Math.round((10 * (mem * 100)) / memTTL) / 10;

		const embed = new MessageEmbed()
			.setAuthor("Aldebaran  |  Bot Statistics", bot.user!.avatarURL()!)
			.setDescription(
				"Multiple informations about Aldebaran are shown on this page, mainly the used resources and the global usage statistics."
			)
			.addField(`Memory Usage (${memPRC}%)`, `**${mem} MB** / ${formatNumber(memTTL)} MB`, true)
			.addField(
				"System CPU Load",
				`**${Math.round(100 * os.loadavg()[0]) / 100}** (${Math.round(100 * os.loadavg()[0] * (100 / 6)) / 100}%)`,
				true
			)
			.addField("Uptime", getTimeString(bot.uptime!, "DD day(s), HH:MM:SS"), true)
			.addField(
				"Commands (Session)",
				formatNumber(bot.stats.commands.total),
				true
			)
			.addField(
				"Users (Session)",
				formatNumber(bot.stats.users.total),
				true
			)
			.addField(
				"Servers (Session)",
				formatNumber(bot.stats.servers.total),
				true
			)
			.addField("Shard ID", bot.shardID, true)
			.setColor(this.color);
		message.channel.send({ embed });
	}
};
