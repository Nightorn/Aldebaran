import { MessageEmbed } from "discord.js";
import os from "os";
import { Command } from "../../groups/Command.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { getTimeString } from "../../utils/Methods.js";

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
		const load = Math.round(100 * os.loadavg()[0]) / 100;
		const loadPC = Math.round(load * (100 / 4)) / 100;

		const embed = new MessageEmbed()
			.setAuthor(`${ctx.client.name}  |  Bot Statistics`, ctx.client.user.displayAvatarURL())
			.setDescription(
				`Data about ${ctx.client.name} are shown on this page, mainly the used resources and the global usage statistics.`
			)
			.addField("Memory Usage", `**${mem} MB**`, true)
			.addField("System CPU Load", `**${load}** (${loadPC}%)`, true)
			.addField("Uptime", getTimeString(ctx.client.uptime!, "DD day(s), HH:MM:SS"), true)
			.addField("Shard ID", ctx.client.shardId.toString(), true)
			.setColor(this.color);
		ctx.reply(embed);
	}
};
