import { MessageEmbed } from "discord.js";
import request from "request";
import fs from "fs";
import canvasModule from "canvas";
import { Command } from "../../groups/DRPGCommand.js";
import { formatNumber, getTimeString, lightOrDark } from "../../utils/Methods.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { drpgLocationdb } from "../../utils/Constants.js";
import { DRPGUser } from "../../interfaces/DiscordRPG.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

const { createCanvas, Image, registerFont, loadImage } = canvasModule;

export default class StatsCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a DiscordRPG user's character and pet infos",
			usage: "UserMention|UserID",
			example: "141610251299454976",
			args: { user: { as: "user" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as { user: string };
		ctx.client.users.fetch(args.user || ctx.message.author.id).then(user => {
			request({
				uri: `http://api.discorddungeons.me/v3/user/${user.id}`,
				headers: { Authorization: process.env.API_DISCORDRPG }
			}, (err, response, body) => {
				if (err) throw err;
				if (response.statusCode === 404) {
					ctx.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
				} else if (response.statusCode === 200) {
					const data = JSON.parse(body).data as DRPGUser;

					const format = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					const skills = [];
					const attributes = [];
					for (const [key, value] of Object.entries(data.skills))
						skills.push(`**${key[0].toUpperCase() + key.slice(1)}** Lv${value.level}`);
					if (data.attributes !== undefined)
						for (const [key, value] of Object.entries(data.attributes))
							if (value !== 0) attributes.push(`**${key[0].toUpperCase() + key.slice(1)}** ${format(value)} Points`);
					const location = data.location ? drpgLocationdb[data.location.current] : "The Abyss";
					const embed = new MessageEmbed()
						.setAuthor(data.name, user.displayAvatarURL())
						.setColor(data.donate ? "GOLD" : 0x00ae86)
						.setDescription(`Currently In **${location || "The Abyss"}**`)
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
							`${data.donate ? "Donator, " : ""}Last seen ${getTimeString(Date.now() - data.lastseen, "DD day(s), HH hour(s), MM minute(s) and SS second(s)")} ago`
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
					ctx.reply(embed);
				} else {
					ctx.reply("the DiscordRPG API seems down, please retry later.");
				}
			});
		}).catch(() => {
			ctx.reply("the ID of the user you specified is invalid. Please retry by mentioning them or by getting their right ID.");
		});
	}

	// eslint-disable-next-line class-methods-use-this
	image(ctx: MessageContext, args: { user: string }) {
		const userId = args.user || ctx.message.author.id;
		ctx.client.users.fetch(userId).then(user => {
			request({
				uri: `http://api.discorddungeons.me/v3/user/${userId}`,
				headers: { Authorization: process.env.API_DISCORDRPG }
			},
			(err, response, body) => {
				if (err) throw err;
				if (response.statusCode === 404) {
					ctx.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
				} else if (response.statusCode === 200) {
					let data = JSON.parse(body);
					data = data.data;
					const newImage = (path: string) => {
						const image = new Image();
						image.src = fs.readFileSync(path);
						return image;
					};
					const avatar = user.displayAvatarURL({ format: "png", size: 128 });
					loadImage(avatar).then(image => {
						const canvas = createCanvas(840, 775);
						const context = canvas.getContext("2d");
						registerFont("./assets/fonts/Exo2-Regular.ttf", {
							family: "Exo 2"
						});
						const bannerFG = lightOrDark(ctx.message.member!.displayHexColor)
							? ["black", "#222222"] : ["white", "#DDDDDD"];

						context.fillStyle = "#222222";
						context.fillRect(0, 0, 840, 775);

						context.fillStyle = ctx.message.member!.displayHexColor;
						context.fillRect(0, 0, 840, 126);

						context.save();
						context.arc(68, 63, 48, 0, 2 * Math.PI, false);
						context.clip();
						context.drawImage(image, 20, 15, 96, 96);
						context.restore();

						context.fillStyle = bannerFG[0];
						context.font = "48px Exo 2";
						context.fillText(user.username, 136, 67);

						context.fillStyle = bannerFG[1];
						context.font = "28px Exo 2";
						context.fillText(`Level ${formatNumber(data.level)}`, 136, 97);

						context.fillStyle = "white";

						context.font = "36px Exo 2";
						context.fillText("Character", 20, 175);

						const hpPercentage = data.hp * 100 / (data.level * 50);
						context.font = "24px Exo 2";
						context.fillText("HP", 210, 173);
						context.fillStyle = "#333333";
						context.fillRect(250, 155, 210, 20);
						context.fillStyle = hpPercentage <= 20 ? "#FF0000" : "#008000";
						context.fillRect(250, 155, hpPercentage * 210 / 100, 20);

						context.fillStyle = "white";

						context.font = "26px Exo 2";
						context.fillText(`    ${formatNumber(data.xp)} XP • ${formatNumber(data.kills)} Kills • ${formatNumber(data.deaths)} Deaths`, 20, 213);

						context.font = "36px Exo 2";
						context.fillText("Currencies", 20, 269);

						context.font = "26px Exo 2";
						context.fillText(`    ${formatNumber(data.gold)} Gold • ${data.lux ? formatNumber(data.lux) : 0} LUX`, 20, 307);

						context.font = "36px Exo 2";
						context.fillText("Skills & Attributes", 20, 363);

						context.font = "26px Exo 2";
						context.fillText(`Mine: Lv${data.skills.mine.level}`, 80, 401);
						context.fillText(`Fish: Lv${data.skills.fish.level}`, 256, 401);
						context.fillText(`Forage: Lv${data.skills.forage.level}`, 424, 401);
						context.fillText(`Chop: Lv${data.skills.chop.level}`, 620, 401);
						context.drawImage(newImage("assets/emojis/pickaxe.png"), 50, 381, 24, 24);
						context.drawImage(newImage("assets/emojis/fish.png"), 224, 377, 24, 24);
						context.drawImage(newImage("assets/emojis/leaves.png"), 392, 379, 24, 24);
						context.drawImage(newImage("assets/emojis/tree.png"), 588, 381, 24, 24);

						context.fillText(`Strength: ${formatNumber(data.attributes.strength)} • XP Boost: ${formatNumber(data.attributes.xpBoost)} • Gold Boost: ${formatNumber(data.attributes.goldBoost)}`, 50, 437);

						context.font = "36px Exo 2";
						context.fillText("Quests", 20, 493);

						context.font = "26px Exo 2";
						let questsNumber = 0;
						if (data.questPoints !== undefined)
							questsNumber = data.questPoints;
						if (questsNumber === 0)
							context.fillText("You have not completed any quest so far.", 50, 531);
						else context.fillText(`You have completed ${questsNumber} quests so far.`, 50, 531);
						if (data.quest.current) {
							context.fillText(`You are currently doing the ${data.quest.current.replace(/([A-Z])/g, (_: string, p1: string) => ` ${p1.toLowerCase()}`)} quest.`, 25, 567);
						} else context.fillText("You are currently not doing any quest.", 50, 567);

						context.font = "36px Exo 2";
						context.fillText("Pet", 20, 623);
						context.fillStyle = "#888888";
						context.fillText(data.pet.name, 80, 623);

						context.font = "26px Exo 2";
						context.fillStyle = "#FFFFFF";
						context.fillText(`${data.pet.type} • Level ${formatNumber(data.pet.level)} (${formatNumber(data.pet.xp)} XP) • XP Rate: ${data.pet.xprate}%`, 50, 661);
						context.fillText(`Your pet is dealing between ${formatNumber(data.pet.damage.min)} and ${formatNumber(data.pet.damage.max)} damage.`, 50, 697);

						context.fillText(`${data.donate ? "Donator, " : ""}Last seen ${getTimeString(Date.now() - data.lastseen, "DD days, HH hours, MM minutes and SS seconds")} ago`, 20, 755);

						ctx.reply({ files: [canvas.toBuffer()] });
					});
				} else {
					ctx.reply("the DiscordRPG API seems down, please retry later.");
				}
			});
		}).catch(err => {
			throw err;
		});
	}
};
