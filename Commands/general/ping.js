const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			description: "Displays the bot's current ping to Discord",
			aliases: ["pong"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message) {
		const embed = new MessageEmbed()
			.addField("WebSocket Heartbeat", `${Math.floor(bot.ping)} ms`, true)
			.addField(`${bot.user.username} Ping`, "Computing...", true)
			.setColor("BLUE");
		const newMessage = await message.channel.send({ embed });
		const ping = newMessage.createdTimestamp - message.createdTimestamp;
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
		let color = "BLUE";
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

		const embedResult = new MessageEmbed()
			.addField("WebSocket Heartbeat", `${Math.floor(bot.ws.ping)} ms`, true)
			.addField(`${bot.user.username} Ping`, `${ping} ms`, true)
			.setColor(color);
		newMessage.edit(desc, { embed: embedResult });
	}
};
