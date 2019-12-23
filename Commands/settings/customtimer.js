const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/SettingsCategory");
const CustomTimer = require("../../structures/Aldebaran/CustomTimer");

module.exports = class CustomTimerCommand extends Command {
	constructor(client) {
		super(client, {
			name: "customtimer",
			description: "Manages your custom timers",
			usage: "Action",
			example: "create",
			aliases: ["ct"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args[0] !== undefined) {
			if (args[0].toLowerCase() === "create") {
				if (args.length > 3) {
					args.shift();
					const times = {
						d: 86400000, h: 3600000, m: 60000, s: 1000
					};
					let timer = args.shift().match(/(\d+\s*[dhms]\b)/ig);
					const channelId = args.includes("-c") ? message.channel.id : null;
					if (channelId !== null) args.splice(args.indexOf("-c"), 1);
					if (timer !== null) {
						timer = timer.reduce((time, str) => time + Number(str.match(/(\d+)\s*([dhms])/i)[1]) * times[RegExp.$2], 0);
						// eslint-disable-next-line no-new
						new CustomTimer(bot, {
							userId: message.author.id,
							timer,
							channelId,
							content: args.join(" ")
						});
						message.channel.send("Your custom timer has been set!");
					} else message.reply("the timer timeout is invalid, it needs to be in the following format: `1337d`, d meaning \"day\", being replaced by s for \"seconds\", m for \"minutes\" and h for \"hours\".");
				} else message.reply("you need to specify the timer timeout, its content and if the timer should be shown in the current channel instead of in your DMs (-c)");
			} else if (args[0].toLowerCase() === "delete") {
				const id = parseInt(args[1], 10);
				if (message.author.customTimers.get(id) !== undefined) {
					message.author.customTimers.get(id).delete();
					message.channel.send("The custom timer has successfully been deleted!");
				} else message.reply("we have not found any custom timer with this ID. Check `&customtimer list` to view the custom timers you have set.");
			} else if (args[0].toLowerCase() === "list") {
				if (message.author.customTimers.size === 0) {
					message.reply("you have not set any custom timer.");
				} else {
					let list = "";
					for (const [id, timer] of message.author.customTimers)
						list += `\`[${id}]\` **${timer.content}** every **${timer.timer / 1000}s**\n`;
					const embed = new MessageEmbed()
						.setAuthor(`${message.author.username}  |  Custom Timers List`, message.author.avatarURL())
						.setDescription(`You have **${message.author.customTimers.size} custom timer(s)** set.\n${list}`)
						.setColor(this.color);
					message.channel.send({ embed });
				}
			} else message.reply("this operation is incorrect.");
		} else message.reply("you need to say what you want to do (create / delete / list)!");
	}
};
