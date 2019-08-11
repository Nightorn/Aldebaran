const { MessageEmbed } = require("discord.js");
const request = require("request");
const math = require("mathjs");
const locationsList = require("./../../Data/drpglocationlist.json");
const itemList = require("../../Data/drpg/itemList.json");
const { Command } = require("../../structures/categories/DRPGCategory");
const userCheck = require("../../functions/action/userCheck");

module.exports = class TrapCommand extends Command {
	constructor(client) {
		super(client, {
			name: "trap",
			description: "Displays users' trap informations and estimated loots",
			usage: "User TrapLocationID Max?",
			example: "240971835330658305 4 --max"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message, args) {
		let userid = null;
		let trapId = null;
		let isMax = false;
		if (args.indexOf("--max") !== -1) {
			args.pop();
			isMax = true;
		}
		if (args.length === 1) {
			try {
				userid = await userCheck(bot, message, args);
			} catch (err) {
				userid = message.author.id;
				[trapId] = args;
			}
		} else if (args.length >= 2) {
			try {
				userid = await userCheck(bot, message, args);
			} catch (err) { /* does nothing */ }
			[, trapId] = args;
		} else {
			userid = message.author.id;
		}

		if (userid !== null) {
			request({
				uri: `http://api.discorddungeons.me/v3/user/${userid}`,
				headers: { Authorization: bot.config.drpg_apikey }
			}, async (err, response, body) => {
				if (err) throw err;
				if (response.statusCode === 404) {
					message.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
				} else if (response.statusCode === 200) {
					const target = await bot.users.fetch(userid);
					const user = JSON.parse(body).data;
					let luck = isMax ? user.level * 5 : user.attributes.salvaging;
					if (luck === 0) luck = 1;
					const data = user.location.traps;
					const f = number => String(number).length === 1 ? `0${number}` : number;
					const getDate = (time, md) => {
						const date = new Date(time);
						if (md)
							return `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`;
						return `${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())} at ${f(date.getHours())}:${f(date.getMinutes())} UTC`;
					};

					if (trapId !== null) {
						if (data[trapId]) {
							const trap = data[trapId];
							const elapsedTime = (Date.now() - trap.time) / 1000;
							const scope = { luck, passed: elapsedTime };
							const pronoun = message.author.id === userid ? "You" : "They";
							let items = "";
							itemList[trap.id].trap.loot.forEach(item => {
								const min = math.eval(item.amount.min, scope);
								const max = math.eval(item.amount.max, scope);
								const itemName = itemList[item.id].name;
								if (elapsedTime > item.mintime) {
									if (min === max)
										items += `- **${min} ${itemName}**\n`;
									else
										items += `- Between **${min}** and **${max} ${itemName}**\n`;
								}
							});
							const embed = new MessageEmbed()
								.setAuthor(`${target.username}  |  Trap Informations  |  ${itemList[trap.id].name} @ ${locationsList[trapId].name}`, target.avatarURL())
								.setDescription(`${pronoun} will receive the following items (with ${luck} point(s) in salvaging)\n${items}`)
								.setFooter(`${pronoun} have set this trap the ${getDate(trap.time)}. You can use "--max" to get results with the max amount of points in salvaging you can have at your current level.`)
								.setColor("GREEN");
							message.channel.send({ embed });
						} else {
							const embed = new MessageEmbed()
								.setAuthor("The requested resource has not been found.", bot.emojis.resolve("609752780261031956").url)
								.setDescription(`You have specified a location where there is no trap. Make sure you are checking the right location by using \`${message.guild.prefix}trap\`.`)
								.setColor("RED")
								.setFooter(target.username, target.avatarURL());
							message.channel.send({ embed });
						}
					} else {
						let traps = "";
						for (const [location, trap] of Object.entries(data)) {
							if (trap.id !== "")
								traps += `\`[${location}]\` **${itemList[trap.id].name}** @ **${locationsList[location].name}** - ${getDate(trap.time, true)}\n`;
						}
						const embed = new MessageEmbed()
							.setAuthor(`${target.username}  |  Trap Informations`, target.avatarURL())
							.setDescription(`${message.author.id === userid ? "You have" : `**${target.username}** has`} **${traps.match(/\n/g).length} traps** set. Please tell us which one you want to view the informations of. Use \`${message.guild.prefix}trap 4\` for example.\n${traps}`)
							.setColor("GREEN");
						message.channel.send({ embed });
					}
				} else {
					message.reply("the DiscordRPG API seems down, please retry later.");
				}
			});
		} else {
			const embed = new MessageEmbed()
				.setAuthor("The requested resource has not been found.", bot.emojis.resolve("609752780261031956").url)
				.setDescription("The user you have specified does not seem to be a valid one. Please make sure you did not make a mistake while typing their ID or mentioning them.")
				.setColor("RED")
				.setFooter(message.author.username, message.author.avatarURL());
			message.channel.send({ embed });
		}
	}
};
