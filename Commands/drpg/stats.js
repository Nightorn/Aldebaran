const { MessageEmbed } = require("discord.js");
const request = require("request");
const locationdb = require("../../Data/drpglocationlist.json");
const userCheck = require("../../functions/action/userCheck");
const { Command } = require("../../structures/categories/DRPGCategory");

module.exports = class StatsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "stats",
			description: "Displays a DiscordRPG user's character and pet infos",
			usage: "UserMention|UserID",
			example: "141610251299454976"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		userCheck(bot, message, args)
			.then(usrid => {
				bot.users.fetch(usrid).then(user => {
					request(
						{
							uri: `http://api.discorddungeons.me/v3/user/${usrid}`,
							headers: { Authorization: bot.config.drpg_apikey }
						},
						(err, response, body) => {
							if (err) throw err;
							if (response.statusCode === 404) {
								message.reply(
									"it looks like the user you specified has not started his adventure on DiscordRPG yet."
								);
							} else if (response.statusCode === 200) {
								let data = JSON.parse(body);
								data = data.data; // eslint-disable-line prefer-destructuring

								const format = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
								const skills = [];
								const attributes = [];
								for (const [key, value] of Object.entries(data.skills))
									skills.push(`**${key[0].toUpperCase() + key.slice(1)}** Lv${value.level}`);
								if (data.attributes !== undefined)
									for (const [key, value] of Object.entries(data.attributes))
										if (value !== 0) attributes.push(
											`**${key[0].toUpperCase() + key.slice(1)}** ${format(
												value
											)} Points`
										);
								const embed = new MessageEmbed()
									.setAuthor(data.name, user.avatarURL())
									.setColor(data.donate ? "GOLD" : 0x00ae86)
									.setDescription(
										`${
											data.location !== undefined
												? `Currently In **${
													locationdb[`${data.location.current}`] !== undefined
														? `${locationdb[`${data.location.current}`].name}**`
														: "The Abyss**"
												}`
												: ""
										}`
									)
									.addField(
										`Level ${format(data.level)}`,
										`**Progression** - ${format(data.kills)} **Kills** | ${
											data.deaths
										} **Deaths** | ${format(
											data.xp
										)} **XP**\n**Currency** - ${format(data.gold)} **Gold** | ${
											data.lux !== undefined ? format(data.lux) : "0"
										} **Lux**`,
										false
									)
									.addField(
										"Specifications",
										`**__Skills__** - ${skills.join(", ")}\n**__Attributes__** - ${
											attributes.length !== 0 ? attributes.join(", ") : "None"
										}`
									)
									.setFooter(
										`${data.donate ? "Donator, " : ""}Last seen ${Date.getTimeString(Date.now() - data.lastseen, "DD day(s), HH hour(s), MM minute(s) and SS second(s)")} ago`
									);
								if (data.quest
									&& (data.quest.current || data.quest.completed)
								) {
									embed.addField(
										"Quests",
										`${
											data.quest.current !== null
												? `**Current** : ${data.quest.current.name}\n`
												: ""
										}${
											data.quest.completed !== undefined
												? `**Completed (${
													data.quest.completed.length
												})** : ${data.quest.completed.join(", ")}`
												: ""
										}`,
										false
									);
								}
								if (data.pet !== undefined)
									if (data.pet.xp !== undefined) embed.addField(
										`Pet (${data.pet.type})`,
										`**Name** : ${data.pet.name} | **Level** ${format(
											data.pet.level
										)}\n${format(data.pet.xp)} **XP** (XP Rate : ${
											data.pet.xprate === undefined ? 0 : data.pet.xprate
										}%) | **Damages** : [${format(
											data.pet.damage.min
										)} - ${format(data.pet.damage.max)}]`,
										false
									);
								message.channel.send({ embed });
							} else {
								message.reply(
									"the DiscordRPG API seems down, please retry later."
								);
							}
						}
					);
				});
			})
			.catch(() => {
				message.reply(
					"The ID of the user you specified is invalid. Please retry by mentioning them or by getting their right ID."
				);
			});
	}

	registerCheck() {
		return this.client.config.drpg_apikey !== undefined
			&& this.client.config.drpg_apikey !== null;
	}
};
