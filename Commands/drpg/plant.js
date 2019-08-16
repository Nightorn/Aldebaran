const request = require("request");
const { MessageEmbed } = require("discord.js");
const math = require("mathjs");
const itemlist = require("../../Data/drpgitemlist.json").data;
const locationdb = require("../../Data/drpglocationlist.json");
const userCheck = require("../../functions/action/userCheck");
const { Command } = require("../../structures/categories/DRPGCategory");

module.exports = class PlantCommand extends Command {
	constructor(client) {
		super(client, {
			name: "plant",
			description: "Displays users plant informations and estimated loots",
			usage: "UserMention|UserID",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		userCheck(bot, message, args).then(usrid => {
			request({ uri: `https://api.discorddungeons.me/v3/user/${usrid}`, headers: { Authorization: bot.config.drpg_apikey } }, async (err, response, body) => {
				if (err) throw err;
				if (response.statusCode === 404) {
					message.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
				} if (response.statusCode === 200) {
					const { data } = JSON.parse(body);
					const user = await bot.users.fetch(usrid);
					if (data.location === undefined) return message.channel.send(`Hey **${data.name}**, travel somewhere and set a trap on your way!`);
					if (data.location.saplings === null || data.location.saplings === undefined) return message.channel.send(`Hey **${data.name}**, please plant some saplings at your purchased fields before!`);
					const embed = new MessageEmbed()
						.setAuthor(`${user.username}  |  Plant Informations`, user.avatarURL())
						.setColor(0x00AE86)
						.setFooter("Please note that all amounts of items shown here are estimations.");


					const f = number => String(number).length === 1
						? `0${number}` : number;
					const getDate = time => {
						const date = new Date(time);
						return `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`;
					};

					for (const [key, value] of Object.entries(data.location.saplings)) {
						if (value !== null) {
							let item = null;
							itemlist.forEach(element => {
								if (element.id === value.id)
									item = element;
							});
							const lootFormulas = item.sapling.loot.amount;
							const currentReap = data.attributes.reaping !== 0
								? data.attributes.reaping : 1;
							const maxReap = Math.round(data.level * 5);
							const plantTime = Math.round((new Date() - value.time) / 1000);
							const currentScope = { luck: currentReap, passed: plantTime };
							const maxScope = { luck: maxReap, passed: plantTime };
							const currentMin = math.eval(lootFormulas.min, currentScope);
							const currentMax = math.eval(lootFormulas.max, currentScope);
							const maxMin = math.eval(lootFormulas.min, maxScope);
							const maxMax = math.eval(lootFormulas.max, maxScope);
							const plantDate = new Date(value.time);
							const locationName = locationdb[`${key}`] !== undefined ? locationdb[`${key}`].name : "???";
							const pronoun = message.author.id === usrid ? "you" : "they";
							const ownership = message.author.id === usrid ? "your" : "their";
							embed.addField(`${item.name} @ ${locationName} - ${Math.floor(plantTime / 86400)} days old`, `Planted the ${getDate(plantDate)}.\nWith ${ownership} **current** reaping skills, ${pronoun} would get between **${currentMin}** and **${currentMax}** items.\nWith the **highest** reaping skills, ${pronoun} would get between **${maxMin}** and **${maxMax}** items.`, false);
						}
					}
					message.channel.send({ embed });
				} else {
					return message.reply("the DiscordRPG API seems down, please retry later.");
				}
				return true;
			});
		}).catch(() => {
			message.reply("**Error** you must enter a valid UserID or User Mention");
		});
	}

	registerCheck() {
		return this.client.config.drpg_apikey !== undefined
			&& this.client.config.drpg_apikey !== null;
	}
};
