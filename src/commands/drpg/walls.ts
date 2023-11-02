import request from "request";
import Command from "../../groups/DRPGCommand.js";
import { formatNumber } from "../../utils/Methods.js";
import { drpgXpBases } from "../../utils/Constants.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

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

function userWall(ctx: MessageContext, lvl: number) {
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
		ctx.reply((e as Error).message);
		throw e;
	}
}

function calcXPNeeded(base: number, lvl: number) {
	return base * (lvl ** 2 + lvl);
}

export default class WallsCommand extends Command {
	constructor() {
		super({
			description: "Displays user's wall progression",
			example: "246302641930502145",
			args: { user: {
				as: "user",
				desc: "The user whose walls progression you want to see",
				optional: true
			} },
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	async run(ctx: MessageContext) {
		const userId = (ctx.args as { user: string }).user || ctx.author.id;
		const user = await ctx.fetchUser(userId);

		request({
			uri: `http://api.discorddungeons.me/v3/user/${user.id}`,
			headers: { Authorization: `X-Api-Key: ${process.env.API_DISCORDRPG}` },
		}, (err, response, body) => {
			if (err) throw err;
			let data;
			try {
				data = JSON.parse(body);
			} catch (e) {
				ctx.reply("the DiscordRPG API seems down, please retry later.");
				return;
			}
			if (response.statusCode === 404) {
				ctx.reply("It looks like the player you mentioned hasn't started their adventure on DiscordRPG.");
				return;
			}

			const [wall, baseLvl] = userWall(ctx, data.level);
			const userAtWall = data.level === baseLvl;
			const xpNeeded = calcXPNeeded(drpgXpBases[baseLvl], baseLvl);
			const wallProgress = xpNeeded - data.xp;

			const embed = new Embed()
				.setColor("#00ae86")
				.setAuthor({
					name: `${user.username}  |  DiscordRPG Walls`,
					iconURL: user.avatarURL
				})
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
	}
}
