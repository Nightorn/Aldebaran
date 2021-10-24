/* eslint-disable no-case-declarations */
/* eslint-disable no-await-in-loop */
import fs from "fs";
import request from "request";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import { Command } from "../../groups/DRPGCommand.js";
import { DRPGAttribute, DRPGGuild, DRPGItem, DRPGSkill, DRPGUser } from "../../interfaces/DiscordRPG.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { drpgItems, drpgLocationdb } from "../../utils/Constants.js";
import { paginate, timeSince } from "../../utils/Methods.js";

export type Guild = DRPGGuild & { users: User[], lastUpdate: number };
export type User = DRPGUser & { lastUpdate: number };

function apiFetch(endpoint: string) {
	return new Promise((resolve, reject) => {
		request({
			uri: `https://api.discorddungeons.me/v3/${endpoint}`,
			headers: { Authorization: process.env.API_DISCORDRPG }
		}, (err, response, body) => {
			if (err) {
				reject(err);
			} else if (response.statusCode !== 200) {
				reject(`Unable to access API. Response code ${response.statusCode}`);
			} else {
				resolve(JSON.parse(body).data);
			}
		});
	});
}

async function updateCache(bot: AldebaranClient) {
	for (const id in bot.drpgCache) {
		if (bot.drpgCache[id].lastUpdate < Date.now() - 3600000) {
			delete bot.drpgCache[id];
		}
	}
	fs.writeFile("./cache/drpgCache.json", JSON.stringify(bot.drpgCache), e => e ? console.error(e) : null);
}

async function getUserData(userID: string, bot: AldebaranClient) {
	const userCache = bot.drpgCache[userID];
	if (userCache && userCache.lastUpdate > Date.now() - 3600000) {
		return userCache as User;
	}
	const userData = await apiFetch(`user/${userID}`).catch(console.error) as User;
	if (!userData) return null;
	userData.lastUpdate = Date.now();
	bot.drpgCache[userData.id] = userData;
	return userData as User;
}

async function getGuild(userData: User, bot: AldebaranClient) {
	const guildID = userData.guild;
	const guildCache = bot.drpgCache[guildID];
	if (guildCache && guildCache.lastUpdate > Date.now() - 3600000) {
		return guildCache;
	}
	const guildData = await apiFetch(`guild/${guildID}`).catch(console.error) as Guild;
	if (!guildData) return false;
	let guildUsers: User[];
	if (guildData.members.length > 1) {
		guildUsers = await apiFetch(`bulk/user/${guildData.members.join(",")}`).catch(console.error) as User[];
		if (!guildUsers) return false;
	} else {
		guildUsers = [userData]; // Lonely boi
	}
	const now = Date.now();
	guildUsers.forEach(user => {
		bot.drpgCache[user.id] = user;
		user.lastUpdate = now;
	});
	guildData.users = guildUsers;
	guildData.lastUpdate = now;
	bot.drpgCache[guildID] = guildData;
	updateCache(bot);
	return guildData;
}

export default class GleadCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a DiscordRPG user's guild leaderboard",
			help: "These are the attributes you can use as the \"attribute\" argument: `level`, `item name`, `gold`, `xp`, `lux`, `deaths`, `kills`, `points`, `questPoints`, `mine`, `chop`, `fish`, `forage`, `crits`, `defense`, `goldBoost`, `lumberBoost`, `mineBoost`, `reaping`, `salvaging`, `scavenge`, `strength`, `taming`, `xpBoost`, `lastseen` and `location`.",
			usage: "[user] [--showid] [--desc] [attribute]",
			example: "141610251299454976 showid --desc lastseen",
			args: {
				user: { as: "user?" },
				showid: { as: "boolean?", flag: { short: "s", long: "showid" } },
				desc: { as: "boolean?", flag: { short: "s", long: "desc" } },
				attribute: { as: "word?" }
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as {
			user?: string,
			showid?: boolean,
			desc?: boolean,
			attribute?: string
		};
		const permissions = ctx.channel.permissionsFor(ctx.client.user);
		if (permissions && !permissions.has("READ_MESSAGE_HISTORY")) {
			return ctx.reply("I need permission to read message history before you can use this feature.");
		} if (permissions && !permissions.has("ADD_REACTIONS")) {
			return ctx.reply("I need permission to add reactions to messages before you can use this feature.");
		}

		// Get guild data, either from the cache or from the API
		const userData = await getUserData(
			args.user || ctx.message.author.id, ctx.client
		);
		if (!userData || !userData.guild) {
			return ctx.reply(`That user isn't in a guild, ${ctx.message.author.username}.`);
		}

		const guildData = await getGuild(userData, ctx.client) as Guild;
		if (!guildData) {
			return ctx.reply("It seems we may have been ratelimited, or the API is down. Please try again in 5 minutes.");
		}
		const guildUsers = guildData.users;

		const index = args.attribute || "level";

		let list: string[] = [];
		let filteredUsers: User[];
		let itemIndex: DRPGItem[];
		let sum: number | string = 0;
		switch (index) {
			case "level":
			case "gold":
			case "xp":
			case "lux":
			case "deaths":
			case "kills":
			case "points":
			case "questPoints":
				guildUsers.sort((a, b) => (b[index as keyof User] as number || 0)
					- (a[index as keyof User] as number || 0));
				sum = guildUsers.reduce(
					(p, c) => (c[index as keyof User] as number || 0) + (p || 0), 0
				);
				list = guildUsers.map(user => `< ${user.name}${args.showid ? ` (${user.id})` : ""} - ${(user[index as keyof User] || 0).toLocaleString()} >`);
				break;
			case "mine":
			case "chop":
			case "fish":
			case "forage":
				guildUsers.sort((a, b) => b.skills[index as DRPGSkill].xp
					- a.skills[index as DRPGSkill].xp);
				sum = guildUsers.reduce(
					(p, c) => c.skills[index as DRPGSkill].level + p, 0
				);
				list = guildUsers.map(user => `< ${user.name}${args.showid ? ` (${user.id})` : ""} - ${user.skills[index as DRPGSkill].level.toLocaleString()} >`);
				break;
			case "crits":
			case "defense":
			case "goldBoost":
			case "lumberBoost":
			case "mineBoost":
			case "reaping":
			case "salvaging":
			case "scavenge":
			case "strength":
			case "taming":
			case "xpBoost":
				guildUsers.sort(
					(a, b) => b.attributes[index as DRPGAttribute]
						- a.attributes[index as DRPGAttribute]
				);
				sum = guildUsers
					.reduce((p, c) => c.attributes[index as DRPGAttribute] + p, 0);
				list = guildUsers.map(user => `< ${user.name}${args.showid ? ` (${user.id})` : ""} - ${user.attributes[index as DRPGAttribute].toLocaleString()} >`);
				break;

			case "lastseen":
				guildUsers.sort((a, b) => (b.lastseen || 0) - (a.lastseen || 0));
				sum = timeSince(Math.floor(guildUsers.reduce(
					(p, c) => (c.lastseen || 0) + (p || 0), 0
				) / guildUsers.length));
				list = guildUsers.map(user => `< ${user.name}${args.showid ? ` (${user.id})` : ""} - ${timeSince(user.lastseen || 0)} >`);
				break;

			case "location":
				const locations: { [key: string]: number } = {};
				guildUsers.forEach(user => {
					let loc = "1";
					if (user.location && user.location.current) {
						loc = user.location.current;
					}
					locations[loc] = locations[loc] + 1 || 1;
				});
				const locArray = Object.entries(locations);
				locArray.sort((a, b) => b[1] - a[1]);
				sum = guildUsers.length;
				list = locArray.map(loc => `${drpgLocationdb[loc[0]]}${args.showid ? ` (${loc[0]})` : ""} - ${loc[1]}`);
				break;

			default:
				itemIndex = Object.values(drpgItems)
					.filter(item => index.toLowerCase() === item.name.toLowerCase());
				if (itemIndex.length === 1) {
					filteredUsers = guildUsers.filter(user => user.inv
						&& user.inv[itemIndex[0].id]
						&& user.inv[itemIndex[0].id]! > 0);
					filteredUsers
						.sort((a, b) => b.inv[itemIndex[0].id]! - a.inv[itemIndex[0].id]!);
					sum = filteredUsers.reduce((p, c) => c.inv[itemIndex[0].id]! + p, 0);
					list = filteredUsers.map(user => `< ${user.name}${args.showid ? ` (${user.id})` : ""} - ${user.inv[itemIndex[0].id]!.toLocaleString()} >`);
				}
				break;
		}

		if (list && list.length > 0) {
			paginate(
				args.desc ? list.reverse() : list, 1,
				`${guildData.name} Lead ${index}`, ctx, `[ Combined ${index} = ${sum.toLocaleString()} ]`
			);
		} else {
			ctx.reply("Unknown leaderboard index.");
		}
		return true;
	}
};
