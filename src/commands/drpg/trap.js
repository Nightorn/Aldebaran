const { MessageEmbed } = require("discord.js");
const request = require("request");
const math = require("mathjs");
const locations = require("./../../../assets/data/drpg/locations.json");
const itemList = require("../../../assets/data/drpg/itemList.json");
const { Command } = require("../../groups/DRPGCommand");

module.exports = class TrapCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays users' trap informations and estimated loots",
			usage: "User TrapLocationID Max?",
			example: "240971835330658305 4 --max",
			args: {
				user: { as: "user" },
				trap: { as: "number" },
				max: { as: "boolean", flag: { short: "m", long: "max" } }
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message, args) {
		const userid = args.user || message.author.id;
		const trapId = args.trap || null;
		const isMax = args.max || false;

		request({
			uri: `http://api.discorddungeons.me/v3/user/${userid}`,
			headers: { Authorization: process.env.API_DISCORDRPG }
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
							.setAuthor(`${target.username}  |  Trap Informations  |  ${itemList[trap.id].name} @ ${locations[trapId]}`, target.avatarURL())
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
							traps += `\`[${location}]\` **${itemList[trap.id].name}** @ **${locations[location]}** - ${getDate(trap.time, true)}\n`;
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
	}

	registerCheck() {
		return process.env.API_DISCORDRPG !== undefined
			&& process.env.API_DISCORDRPG !== null;
	}
};
