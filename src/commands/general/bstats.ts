import { MessageEmbed } from "discord.js";
import os from "os";
import { Command } from "../../groups/Command.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { formatNumber, getTimeString } from "../../utils/Methods.js";

export default class BStatsCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays the bot usage statistics since the last start"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const processMemory = process.memoryUsage().heapTotal;
		const mem = Math.round((100 * processMemory) / 1048576) / 100;
		const memTTL = Math.round(100 * (mem + os.freemem() / 1048576)) / 100;
		const memPRC = Math.round((10 * (mem * 100)) / memTTL) / 10;

		const embed = new MessageEmbed()
			.setAuthor("Aldebaran  |  Bot Statistics", ctx.client.user.avatarURL()!)
			.setDescription(
				"Multiple informations about Aldebaran are shown on this page, mainly the used resources and the global usage statistics."
			)
			.addField(`Memory Usage (${memPRC}%)`, `**${mem} MB** / ${formatNumber(memTTL)} MB`, true)
			.addField(
				"System CPU Load",
				`**${Math.round(100 * os.loadavg()[0]) / 100}** (${Math.round(100 * os.loadavg()[0] * (100 / 6)) / 100}%)`,
				true
			)
			.addField("Uptime", getTimeString(ctx.client.uptime!, "DD day(s), HH:MM:SS"), true)
			.addField("Shard ID", ctx.client.shardId.toString(), true)
			.setColor(this.color);
		ctx.reply(embed);
	}
};
