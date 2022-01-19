import { MessageEmbed } from "discord.js";
import request from "request";
import { evaluate } from "mathjs";
import { Command } from "../../groups/DRPGCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { drpgItems, drpgLocationdb } from "../../utils/Constants.js";
import { DRPGUser } from "../../interfaces/DiscordRPG.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class TrapCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays users' trap informations and estimated loots",
			usage: "User TrapLocationID Max?",
			example: "240971835330658305 4 --max",
			args: {
				user: { as: "user", optional: true },
				trap: { as: "number", optional: true },
				max: {
					as: "boolean",
					flag: { short: "m", long: "max" },
					optional: true
				}
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as {
			user: string,
			trap: string,
			max: boolean
		};
		const userid = args.user || ctx.message.author.id;
		const trapId = args.trap || null;
		const isMax = args.max || false;

		request({
			uri: `http://api.discorddungeons.me/v3/user/${userid}`,
			headers: { Authorization: process.env.API_DISCORDRPG }
		}, async (err, response, body) => {
			if (err) throw err;
			if (response.statusCode === 404) {
				ctx.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
			} else if (response.statusCode === 200) {
				const target = await ctx.client.users.fetch(userid);
				const user = JSON.parse(body).data as DRPGUser;
				let luck = isMax ? user.level * 5 : user.attributes.salvaging;
				if (luck === 0) luck = 1;
				const data = user.location.traps;
				const f = (number: number) => String(number).length === 1 ? `0${number}` : number;
				const getDate = (time: number, md?: boolean) => {
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
						const pronoun = ctx.message.author.id === userid ? "You" : "They";
						let items = "";
						drpgItems[trap.id].trap!.loot.forEach(item => {
							const min = evaluate(item.amount.min, scope);
							const max = evaluate(item.amount.max, scope);
							const itemName = drpgItems[item.id].name;
							if (elapsedTime > item.mintime) {
								if (min === max)
									items += `- **${min} ${itemName}**\n`;
								else
									items += `- Between **${min}** and **${max} ${itemName}**\n`;
							}
						});
						const embed = new MessageEmbed()
							.setAuthor(`${target.username}  |  Trap Informations  |  ${drpgItems[trap.id].name} @ ${drpgLocationdb[trapId]}`, target.displayAvatarURL())
							.setDescription(`${pronoun} will receive the following items (with ${luck} point(s) in salvaging)\n${items}`)
							.setFooter(`${pronoun} have set this trap the ${getDate(trap.time)}. You can use "--max" to get results with the max amount of points in salvaging you can have at your current level.`)
							.setColor("GREEN");
						ctx.reply(embed);
					} else {
						const embed = new MessageEmbed()
							.setAuthor("The requested resource has not been found.")
							.setDescription(`You have specified a location where there is no trap. Make sure you are checking the right location by using \`${ctx.prefix}trap\`.`)
							.setColor("RED")
							.setFooter(target.username, target.displayAvatarURL());
						ctx.reply(embed);
					}
				} else {
					let traps = "";
					for (const [location, trap] of Object.entries(data)) {
						if (trap.id !== "")
							traps += `\`[${location}]\` **${drpgItems[trap.id].name}** @ **${drpgLocationdb[location]}** - ${getDate(trap.time, true)}\n`;
					}
					const embed = new MessageEmbed()
						.setAuthor(`${target.username}  |  Trap Informations`, target.displayAvatarURL())
						.setDescription(`${ctx.message.author.id === userid ? "You have" : `**${target.username}** has`} **${traps.match(/\n/g)!.length} traps** set. Please tell us which one you want to view the informations of. Use \`${ctx.prefix}trap 4\` for example.\n${traps}`)
						.setColor("GREEN");
					ctx.reply(embed);
				}
			} else {
				ctx.reply("the DiscordRPG API seems down, please retry later.");
			}
		});
	}
};
