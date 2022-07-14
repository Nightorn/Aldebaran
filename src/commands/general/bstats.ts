import os from "os";
import Command from "../../groups/Command.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { getTimeString } from "../../utils/Methods.js";

export default class BStatsCommand extends Command {
	constructor() {
		super({
			description: "Displays the bot usage statistics since the last start"
		});
	}

	run(ctx: MessageContext) {
		const processMemory = process.memoryUsage().heapTotal;
		const mem = Math.round((100 * processMemory) / 1048576) / 100;
		const load = Math.round(100 * os.loadavg()[0]) / 100;
		const loadPC = Math.round(load * (100 / 4)) / 100;

		const uptime = getTimeString(process.uptime() * 1000, "DD day(s), HH:MM:SS");
		const embed = this.createEmbed(ctx)
			.setTitle("Bot Statistics")
			.setDescription(
				`Data about ${ctx.client.name} are shown on this page, mainly the used resources and the global usage statistics.`
			)
			.addField("Memory Usage", `**${mem} MB**`, true)
			.addField("System CPU Load", `**${load}** (${loadPC}%)`, true)
			.addField("Uptime", uptime, true);
		ctx.reply(embed);
	}
}
