/* eslint-disable no-case-declarations */
/* eslint-disable no-await-in-loop */
const fs = require("fs");
const Message = require("discord.js");
const request = require("request");
const locationdb = require("../../../assets/data/drpg/locations.json");
const { Command } = require("../../groups/DRPGCommand");
const items = Object.values(require("../../../assets/data/drpg/itemList.json"));

function apiFetch(endpoint, bot) {
	return new Promise((resolve, reject) => {
		request({
			uri: `http://api.discorddungeons.me/v3/${endpoint}`,
			headers: { Authorization: bot.config.drpg_apikey }
		}, (err, response, body) => {
			if (err) {
				reject(err);
			} else if (response.statusCode !== 200) {
				// eslint-disable-next-line prefer-promise-reject-errors
				reject(`Unable to access API. Response code ${response.statusCode}`);
			} else {
				resolve(JSON.parse(body).data);
			}
		});
	});
}

/**
 * Paginates a list for user convenience
 * @param {Array<String>} list The array of items to be paginated
 * @param {Number} page The page number to start on
 * @param {String} headerText The text on the top line of the page
 * @param {Message} message The user's discord.js Message
 * @param {String} footerText The text on the bottom line of the page
 */
async function paginate(list, page, headerText, message, footerText) {
	const maxPage = Math.ceil(list.length / 15);
	if (page < 1) {
		page = 1;
	} else if (page > maxPage) {
		page = maxPage;
	}
	let header = `#=====[ ${headerText} (page ${page}/${maxPage}) ]=====#`;
	let body = list.slice(page * 15 - 15, page * 15).join("\n");
	let footer = `#${"".padEnd(Math.floor(header.length / 2 - footerText.length / 2) - 1, "=")}${footerText}${"".padEnd(Math.ceil(header.length / 2 - footerText.length / 2) - 1, "=")}#`;

	const msg = await message.channel.send(`\`\`\`md\n${header}\n${body}\n${footer}\`\`\``);
	if (maxPage > 1) {
		const reactions = ["⬅", "❌", "➡"]
		for (const react of reactions) {
			await msg.react(react);
		}
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const collect = await msg.awaitReactions((reaction, user) => user.id === message.author.id && reactions.includes(reaction.emoji.name), { time: 60000, max: 1 }).catch(console.error);

			if (collect.size) {
				const reaction = collect.first();
				const emoji = collect.first().emoji.name;
				const prevPage = page;
				if (emoji === "⬅") {
					if (page > 1) {
						page--;
					}
				} else if (emoji === "➡") {
					if (page < maxPage) {
						page++;
					}
				}

				if (emoji !== "❌") reaction.users.remove(message.author);

				if (prevPage !== page) {
					header = `#=====[ ${headerText} (page ${page}/${maxPage}) ]=====#`;
					body = list.slice(page * 15 - 15, page * 15).join("\n");
					footer = `#${"".padEnd(Math.floor(header.length / 2 - footerText.length / 2) - 1, "=")}${footerText}${"".padEnd(Math.ceil(header.length / 2 - footerText.length / 2) - 1, "=")}#`;
					await msg.edit(`\`\`\`md\n${header}\n${body}\n${footer}\`\`\``);
				}
			}
			if (!collect.size || collect.first().emoji.name === "❌") {
				msg.reactions.removeAll();
				break;
			}
		}
	}
}

function timeSince(timestamp) {
	let ellapsed = Date.now() - timestamp;
	const years = Math.floor(ellapsed / (365 * 24 * 60 * 60 * 1000));
	ellapsed -= years * (365 * 24 * 60 * 60 * 1000);
	const days = Math.floor(ellapsed / (24 * 60 * 60 * 1000));
	ellapsed -= days * (24 * 60 * 60 * 1000);
	const hours = Math.floor(ellapsed / (60 * 60 * 1000));
	ellapsed -= hours * (60 * 60 * 1000);
	const minutes = Math.floor(ellapsed / (60 * 1000));

	let str = "";
	let units = 0; // The number of units the time is measured in; max of 2
	if (years) {
		str += `${years} year${years > 1 ? "s" : ""}`;
		units++;
	}
	if (!units && days || units) {
		str += `${str ? " and " : ""}${days} day${days !== 1 ? "s" : ""}`;
		units++;
	}
	if (!units && hours || units === 1) {
		str += `${str ? " and " : ""}${hours} hour${hours !== 1 ? "s" : ""}`;
		units++;
	}
	if (!units && minutes || units === 1) {
		str += `${str ? " and " : ""}${minutes} minute${minutes !== 1 ? "s" : ""}`;
	}

	return str;
}

async function updateCache(bot) {
	for (const id in bot.drpgCache) {
		if (bot.drpgCache[id].lastUpdate < Date.now() - 3600000) {
			delete bot.drpgCache[id];
		}
	}

	fs.writeFile("./cache/drpgCache.json", JSON.stringify(bot.drpgCache), console.error);
}

async function getUserData(userID, bot) {
	if (bot.drpgCache[userID] && bot.drpgCache[userID].lastUpdate > Date.now() - 3600000) {
		return bot.drpgCache[userID];
	}
	return apiFetch(`user/${userID}`, bot).catch(console.error);
}

async function getGuild(guildID, bot) {
	if (bot.drpgCache[guildID] && bot.drpgCache[guildID].lastUpdate > Date.now() - 3600000) {
		return bot.drpgCache[guildID];
	}
	const guildData = await apiFetch(`guild/${guildID}`, bot).catch(console.error);
	if (!guildData) return false;
	let guildUsers;
	if (guildData.members.length > 1) {
		guildUsers = await apiFetch(`bulk/user/${guildData.members.join(",")}`, bot).catch(console.error);
		if (!guildUsers) return false;
	} else {
		const user = await getUserData(guildData.members[0], bot);
		if (!user) return false;
		guildUsers = [user]; // Lonely boi
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

module.exports = class GleadCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a DiscordRPG user's guild leaderboard",
			usage: "[user] [showid] [--desc] [level |\nitem name |\ngold |\nxp |\nlux |\ndeaths |\nkills |\npoints |\nquestPoints |\nmine |\nchop |\nfish |\nforage |\ncrits |\ndefense |\ngoldBoost |\nlumberBoost |\nmineBoost |\nreaping |\nsalvaging |\nscavenge |\nstrength |\ntaming |\nxpBoost |\nlastseen |\nlocation]",
			example: "141610251299454976 showid --desc lastseen",
			args: {
				user: { as: "user?" }
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message, args) {
		// Get guild data, either from the cache or from the API
		const userData = await getUserData(args.user || message.author.id, bot);
		if (!userData || !userData.guild) {
			message.channel.send(`That user isn't in a guild, ${message.author.username}.`);
			return;
		}

		const guildData = await getGuild(userData.guild, bot);
		if (!guildData) {
			message.channel.send("It seems we may have been ratelimited, or the API is down. Please try again in 5 minutes.");
			return;
		}
		const guildUsers = guildData.users;

		let Args = message.args;
		let showid = false;
		if (message.content.toLowerCase().includes("showid")) {
			Args = Args.filter(arg => !arg.toLowerCase().includes("showid"));
			showid = true;
		}

		let desc = false;
		if (Args.includes("--desc")) {
			Args.splice(Args.indexOf("--desc"), 1);
			desc = true;
		}

		let index;
		if (args.user) {
			index = Args.slice(1).join(" ");
		} else {
			index = Args.join(" ");
		}
		if (!index) {
			index = "level";
		}

		let list;
		let filteredUsers;
		let itemIndex;
		let sum = 0;
		switch (index) {
		case "level":
		case "gold":
		case "xp":
		case "lux":
		case "deaths":
		case "kills":
		case "points":
		case "questPoints":
			guildUsers.sort((a, b) => (b[index] || 0) - (a[index] || 0));
			sum = guildUsers.reduce((p, c) => (c[index] || 0) + (p || 0), 0);
			list = guildUsers.map(user => `< ${user.name}${showid ? ` (${user.id})` : ""} - ${(user[index] || 0).toLocaleString()} >`);
			break;
		case "mine":
		case "chop":
		case "fish":
		case "forage":
			guildUsers.sort((a, b) => b.skills[index].xp - a.skills[index].xp);
			sum = guildUsers.reduce((p, c) => c.skills[index].level + p, 0);
			list = guildUsers.map(user => `< ${user.name}${showid ? ` (${user.id})` : ""} - ${user.skills[index].level.toLocaleString()} >`);
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
			guildUsers.sort((a, b) => b.attributes[index] - a.atttributes[index]);
			sum = guildUsers.reduce((p, c) => c.attributes[index] + p, 0);
			list = guildUsers.map(user => `< ${user.name}${showid ? ` (${user.id})` : ""} - ${user.attributes[index].toLocaleString()} >`);
			break;

		case "lastseen":
			guildUsers.sort((a, b) => (b[index] || 0) - (a[index] || 0));
			sum = timeSince(Math.floor(guildUsers.reduce((p, c) => (c[index] || 0) + (p || 0), 0) / guildUsers.length));
			list = guildUsers.map(user => `< ${user.name}${showid ? ` (${user.id})` : ""} - ${timeSince(user[index] || 0)} >`);
			break;

		case "location":
			const locations = {};
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
			list = locArray.map(loc => `${locationdb[loc[0]]}${showid ? ` (${loc[0]})` : ""} - ${loc[1]}`);
			break;

		default:
			itemIndex = items.filter(item => index.toLowerCase() === item.name.toLowerCase());
			if (itemIndex.length === 1) {
				filteredUsers = guildUsers.filter(user => user.inv && user.inv[itemIndex[0].id] && user.inv[itemIndex[0].id] > 0);
				filteredUsers.sort((a, b) => b.inv[itemIndex[0].id] - a.inv[itemIndex[0].id]);
				sum = filteredUsers.reduce((p, c) => c.inv[itemIndex[0].id] + p, 0);
				list = filteredUsers.map(user => `< ${user.name}${showid ? ` (${user.id})` : ""} - ${user.inv[itemIndex[0].id].toLocaleString()} >`);
			}
			break;
		}

		if (list && list.length > 0) {
			paginate(desc ? list.reverse() : list, 1, `${guildData.name} Lead ${index}`, message, `[ Combined ${index} = ${sum.toLocaleString()} ]`);
		} else {
			message.channel.send("Unknown leaderboard index.");
		}
	}

	registerCheck() {
		return this.client.config.drpg_apikey !== undefined
			&& this.client.config.drpg_apikey !== null;
	}
};
