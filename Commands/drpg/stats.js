const { MessageEmbed } = require("discord.js");
const request = require("request");
const fs = require("fs");
const {
	createCanvas, Image, registerFont, loadImage
} = require("canvas");
const locationdb = require("../../Data/drpglocationlist.json");
const userCheck = require("../../functions/action/userCheck");
const { Command } = require("../../structures/categories/DRPGCategory");
const lightOrDark = require("../../functions/utils/lightOrDark");

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
		userCheck(bot, message, args).then(usrid => {
			bot.users.fetch(usrid).then(user => {
				request({
					uri: `http://api.discorddungeons.me/v3/user/${usrid}`,
					headers: { Authorization: bot.config.drpg_apikey }
				}, (err, response, body) => {
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
				});
			});
		}).catch(() => {
			message.reply(
				"The ID of the user you specified is invalid. Please retry by mentioning them or by getting their right ID."
			);
		});
	}

	// eslint-disable-next-line class-methods-use-this
	image(bot, message, args) {
		let userId = message.author.id;
		if (message.mentions.users.size !== 0)
			userId = message.mentions.users.first().id;
		else if (args[1] !== undefined) userId = args[1];
		bot.users.fetch(userId).then(user => {
			request({
				uri: `http://api.discorddungeons.me/v3/user/${userId}`,
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
					data = data.data;
					const newImage = path => {
						const image = new Image();
						image.src = fs.readFileSync(path);
						return image;
					};
					const avatar = user.displayAvatarURL({ format: "png", size: 128 });
					loadImage(avatar).then(image => {
						const canvas = createCanvas(840, 775);
						const ctx = canvas.getContext("2d");
						registerFont("./assets/fonts/Exo2-Regular.ttf", {
							family: "Exo 2"
						});
						const bannerFG = lightOrDark(message.member.displayHexColor)
							? ["black", "#222222"] : ["white", "#DDDDDD"];

						ctx.fillStyle = "#222222";
						ctx.fillRect(0, 0, 840, 775);

						ctx.fillStyle = message.member.displayHexColor;
						ctx.fillRect(0, 0, 840, 126);

						ctx.save();
						ctx.arc(68, 63, 48, 0, 2 * Math.PI, false);
						ctx.clip();
						ctx.drawImage(image, 20, 15, 96, 96);
						ctx.restore();

						ctx.fillStyle = bannerFG[0];
						ctx.font = "48px Exo 2";
						ctx.fillText(user.username, 136, 67);

						ctx.fillStyle = bannerFG[1];
						ctx.font = "28px Exo 2";
						ctx.fillText(`Level ${Number.formatNumber(data.level)}`, 136, 97);

						ctx.fillStyle = "white";

						ctx.font = "36px Exo 2";
						ctx.fillText("Character", 20, 175);

						const hpPercentage = data.hp * 100 / (data.level * 50);
						ctx.font = "24px Exo 2";
						ctx.fillText("HP", 210, 173);
						ctx.fillStyle = "#333333";
						ctx.fillRect(250, 155, 210, 20);
						ctx.fillStyle = hpPercentage <= 20 ? "#FF0000" : "#008000";
						ctx.fillRect(250, 155, hpPercentage * 210 / 100, 20);

						ctx.fillStyle = "white";

						ctx.font = "26px Exo 2";
						ctx.fillText(`    ${Number.formatNumber(data.xp)} XP • ${Number.formatNumber(data.kills)} Kills • ${Number.formatNumber(data.deaths)} Deaths`, 20, 213);

						ctx.font = "36px Exo 2";
						ctx.fillText("Currencies", 20, 269);

						ctx.font = "26px Exo 2";
						ctx.fillText(`    ${Number.formatNumber(data.gold)} Gold • ${data.lux ? Number.formatNumber(data.lux) : 0} LUX`, 20, 307);

						ctx.font = "36px Exo 2";
						ctx.fillText("Skills & Attributes", 20, 363);

						ctx.font = "26px Exo 2";
						ctx.fillText(`Mine: Lv${data.skills.mine.level}`, 80, 401);
						ctx.fillText(`Fish: Lv${data.skills.fish.level}`, 256, 401);
						ctx.fillText(`Forage: Lv${data.skills.forage.level}`, 424, 401);
						ctx.fillText(`Chop: Lv${data.skills.chop.level}`, 620, 401);
						ctx.drawImage(newImage("assets/emojis/pickaxe.png"), 50, 381, 24, 24);
						ctx.drawImage(newImage("assets/emojis/fish.png"), 224, 377, 24, 24);
						ctx.drawImage(newImage("assets/emojis/leaves.png"), 392, 379, 24, 24);
						ctx.drawImage(newImage("assets/emojis/tree.png"), 588, 381, 24, 24);

						ctx.fillText(`Strength: ${Number.formatNumber(data.attributes.strength)} • XP Boost: ${Number.formatNumber(data.attributes.xpBoost)} • Gold Boost: ${Number.formatNumber(data.attributes.goldBoost)}`, 50, 437);

						ctx.font = "36px Exo 2";
						ctx.fillText("Quests", 20, 493);

						ctx.font = "26px Exo 2";
						let questsNumber = 0;
						if (data.questPoints !== undefined)
							questsNumber = data.questPoints;
						if (questsNumber === 0)
							ctx.fillText("You have not completed any quest so far.", 50, 531);
						else ctx.fillText(`You have completed ${questsNumber} quests so far.`, 50, 531);
						if (data.quest.current)
							ctx.fillText(`You are currently doing the ${data.quest.current.replace(/([A-Z])/g, (matches, p1) => ` ${p1.toLowerCase()}`)} quest.`, 25, 567);
						else ctx.fillText("You are currently not doing any quest.", 50, 567);

						ctx.font = "36px Exo 2";
						ctx.fillText("Pet", 20, 623);
						ctx.fillStyle = "#888888";
						ctx.fillText(data.pet.name, 80, 623);

						ctx.font = "26px Exo 2";
						ctx.fillStyle = "#FFFFFF";
						ctx.fillText(`${data.pet.type} • Level ${Number.formatNumber(data.pet.level)} (${Number.formatNumber(data.pet.xp)} XP) • XP Rate: ${data.pet.xprate}%`, 50, 661);
						ctx.fillText(`Your pet is doing between ${Number.formatNumber(data.pet.damage.min)} and ${Number.formatNumber(data.pet.damage.max)} damages.`, 50, 697);

						ctx.fillText(`${data.donate ? "Donator, " : ""}Last seen ${Date.getTimeString(Date.now() - data.lastseen, "DD days, HH hours, MM minutes and SS seconds")} ago`, 20, 755);

						message.channel.send({
							files: [
								canvas.toBuffer()
							]
						});
					});
				} else {
					message.reply(
						"the DiscordRPG API seems down, please retry later."
					);
				}
			});
		}).catch(err => {
			throw err;
		});
	}

	registerCheck() {
		return this.client.config.drpg_apikey !== undefined
			&& this.client.config.drpg_apikey !== null;
	}
};
