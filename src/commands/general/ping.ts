import Command from "../../groups/Command.js";
import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../../structures/contexts/DiscordSlashMessageContext.js";
import DiscordContext from "../../structures/contexts/DiscordContext.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";
import RevoltMessageContext from "../../structures/contexts/RevoltMessageContext.js";

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

function createEmbed(ctx: MessageContext, ping: number, wsPing: number) {
	let color = "Blue";
	let content = "Hi.";

	if (ping < 0) {
		color = "Purple";
		content = messages.negative[
			Math.floor(Math.random() * messages.negative.length)
		];
	} else if (ping <= 500) {
		color = "Green";
		content = messages.good[Math.floor(Math.random() * messages.good.length)];
	} else if (ping > 1000) {
		color = "Red";
		content = messages.bad[Math.floor(Math.random() * messages.bad.length)];
	} else if (ping > 500) {
		color = "Orange";
		content = messages.average[
			Math.floor(Math.random() * messages.average.length)
		];
	}

	const embed = new Embed()
		.addField("WebSocket Heartbeat", `${wsPing} ms`, true)
		.addField(`${ctx.client.name} Ping`, `${ping} ms`, true)
		.setColor(color);

	return { content, embed };
}

export default class PingCommand extends Command {
	constructor() {
		super({
			description: "Displays the bot's current ping to Discord",
			aliases: ["pong"]
		});
	}

	async run(ctx: MessageContext) {
		const wsPing = ctx instanceof DiscordContext
			? ctx.client.discord.ws.ping
			: (ctx as RevoltMessageContext).client.revolt.websocket.ping as number;

		const starterEmbed = new Embed()
			.addField("WebSocket Heartbeat", `${Math.floor(wsPing)} ms`, true)
			.addField(`${ctx.client.name} Ping`, "Computing...", true)
			.setColor("Blue");

		if (ctx instanceof DiscordContext) {
			const message = ctx instanceof DiscordSlashMessageContext
				? await ctx.reply(starterEmbed, false, true)
				: await (ctx as DiscordMessageContext).reply(starterEmbed);
			const ping = message.createdTimestamp - ctx.createdAt.getTime();
			const { content, embed } = createEmbed(ctx, ping, wsPing);
			message.edit({ content, embeds: [embed.toDiscordEmbed()] });
		} else if (ctx instanceof RevoltMessageContext) {
			const message = await ctx.reply(starterEmbed);
			const ping = message.createdAt - ctx.createdAt.getTime();
			const { content, embed } = createEmbed(ctx, ping, wsPing);
			message.edit({ content, embeds: [await embed.toRevoltEmbed()] });
		}
	}
}
