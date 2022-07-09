import { ColorResolvable, MessageEmbed } from "discord.js";
import Command from "../../groups/Command.js";
import Client from "../../structures/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { Platform } from "../../utils/Constants.js";
import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../../structures/contexts/DiscordSlashMessageContext.js";

const messages = {
	good: [
		"This latency looks pretty low!",
		"Gotta go fast!"
	],
	average: [
		"Not the best latency ever, but it's alright.",
		"Hey it's laggy! It's still working though?"
	],
	bad: [
		"Oops, looks like we are running slow.",
		"This number is way too high!"
	],
	negative: [
		"I am speed!"
	]
};

export default class PingCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Displays the bot's current ping to Discord",
			aliases: ["pong"],
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext, platform: Platform) {
		const embed = new MessageEmbed()
			.addField("WebSocket Heartbeat", `${Math.floor(ctx.client.discord.ws.ping)} ms`, true)
			.addField(`${ctx.client.name} Ping`, "Computing...", true)
			.setColor("BLUE");
		let msg = null;
		if (platform === "DISCORD") {
			msg = await (ctx as DiscordMessageContext).reply(embed);
		} else if (platform === "DISCORD_SLASH") {
			msg = await (ctx as DiscordSlashMessageContext).reply(embed, false, true);
		}
		const ping = msg!.createdTimestamp - ctx.createdTimestamp;
		let color: ColorResolvable = "BLUE";
		let desc = "Hi.";

		if (ping < 0) {
			color = "PURPLE";
			desc = messages.negative[
				Math.floor(Math.random() * messages.negative.length)
			];
		} else if (ping <= 500) {
			color = "GREEN";
			desc = messages.good[Math.floor(Math.random() * messages.good.length)];
		} else if (ping > 1000) {
			color = "RED";
			desc = messages.bad[Math.floor(Math.random() * messages.bad.length)];
		} else if (ping > 500) {
			color = "ORANGE";
			desc = messages.average[
				Math.floor(Math.random() * messages.average.length)
			];
		}

        const ws = Math.floor(ctx.client.discord.ws.ping);
		const embedResult = new MessageEmbed()
			.addField("WebSocket Heartbeat", `${ws} ms`, true)
			.addField(`${ctx.client.name} Ping`, `${ping} ms`, true)
			.setColor(color);
		msg!.edit({ content: desc, embeds: [embedResult] });
	}
}
