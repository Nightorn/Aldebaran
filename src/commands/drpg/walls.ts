import { Message, MessageEmbed } from "discord.js";
import request from "request";
import { Command } from "../../groups/DRPGCommand.js";
import { formatNumber } from "../../utils/Methods.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { drpgXpBases } from "../../utils/Constants.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class WallsCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays user's wall informations",
			usage: "UserMention|UserID",
			example: "246302641930502145"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		function calcWall(
			lvl: number | string,
			base: number | string,
			prevWall: number | string
		) {
			const L = Number(lvl);
			const B = Number(base);
			const C = prevWall ? Number(prevWall) : 25;
			return L * (B + C) + L ** 2 * (B - C);
		}

		function findKeyAbove(level: number) {
			let loops = 0; // prevent timeout
			while (drpgXpBases[level] === undefined) {
				level++;
				loops++;
				if (loops > 50000) {
					throw new Error("The level you entered was too high, command timed out.");
				}
			}
			return level;
		}

		function findKeyBelow(level: number) {
			let loops = 0;
			while (drpgXpBases[level] === undefined && level > 0) {
				level--;
				loops++;
				if (loops > 50000) {
					throw new Error("The level you entered was too high, command timed out.");
				}
			}
			return level;
		}

		function userWall(msg: Message, lvl: number) {
			try {
				const baseLvl = findKeyAbove(lvl);
				const prevBaseLvl = findKeyBelow(lvl - 1);

				const base = drpgXpBases[baseLvl];
				let prevBase = 0;
				if (!drpgXpBases[prevBaseLvl]) {
					prevBase = 25;
				} else {
					prevBase = drpgXpBases[prevBaseLvl];
				}
				const wall = calcWall(baseLvl, base, prevBase);

				return [wall, baseLvl];
			} catch (e) {
				msg.reply(e.msg);
				throw e;
			}
		}
		function calcXPNeeded(base: number, lvl: number) {
			return base * (lvl ** 2 + lvl);
		}

		try {
			const user = await ctx.client.users.fetch(args[0] || ctx.message.author.id);
			request({
				uri: `http://api.discorddungeons.me/v3/user/${user.id}`,
				headers: { Authorization: process.env.API_DISCORDRPG }
			}, (err, _, body) => {
				if (err) throw err;
				let data;
				try {
					data = JSON.parse(body);
				} catch (e) {
					ctx.reply("the DiscordRPG API seems down, please retry later.");
					return;
				}
				if (data.status === 404) {
					ctx.reply("It looks like the player you mentioned hasn't started their adventure on DiscordRPG.");
					return;
				}
				data = data.data;

				const [wall, baseLvl] = userWall(ctx.message, data.level);
				const userAtWall = data.level === baseLvl;
				const xpNeeded = calcXPNeeded(drpgXpBases[baseLvl], baseLvl);
				const wallProgress = xpNeeded - data.xp;

				const embed = new MessageEmbed()
					.setColor(0x00ae86)
					.setAuthor(`${user.username}  |  DiscordRPG Walls`,
						user.displayAvatarURL())
					.addField(
						`Base at Level ${baseLvl}`,
						`The baseXP (the increment of XP needed to level up - the "XP ramp") for Level ${baseLvl} is ${drpgXpBases[baseLvl]}.`
					);

				if (userAtWall) {
					embed.addField(
						`Level ${baseLvl} wall`,
						`They're at a ${wall.toLocaleString("en-US")} XP wall.`
					);
					embed.addField(
						`${user.username}'s progress`,
						`**${formatNumber(wall - wallProgress)} XP** / ${formatNumber(wall)} XP (**${Math.round(
							100 * ((wall - wallProgress) * 100) / wall
						) / 100}%**)`
					);
				} else {
					embed.addField(
						`${user.username}'s next wall`,
						`Level ${baseLvl}: ${wall.toLocaleString(
							"en-US"
						)} XP wall\nYou will need ${xpNeeded.toLocaleString(
							"en-US"
						)} XP total at level ${baseLvl}.`
					);
				}
				ctx.reply(embed);
			});
		} catch (err) {
			const [wall, baseLvl] = userWall(ctx.message, Number(args[0]));
			const xpNeeded = calcXPNeeded(drpgXpBases[baseLvl], baseLvl);

			const embed = new MessageEmbed()
				.setColor(0x00ae86)
				.setAuthor(
					ctx.message.author.username, 
					ctx.message.author.displayAvatarURL()
				)
				.setTitle(`Wall closest to Level ${args[0]}`)
				.addField(
					`Base at Level ${baseLvl}`,
					`The baseXP (the increment of XP needed to level up - the "XP ramp") for Level ${baseLvl} is ${drpgXpBases[baseLvl]}.`
				)
				.addField(
					`Level ${baseLvl} wall`,
					`The wall at Level ${baseLvl} is ${wall.toLocaleString(
						"en-US"
					)} XP. You will need ${xpNeeded.toLocaleString(
						"en-US"
					)} XP total to progress at that level.`
				);
			ctx.reply(embed);
		}
	}
};
