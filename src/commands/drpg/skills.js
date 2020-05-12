const { MessageEmbed } = require("discord.js");
const request = require("request");
const { Command } = require("../../groups/DRPGCommand");
const itemList = require("../../../assets/data/drpg/itemList.json");

module.exports = class SkillsCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays users' skills informations",
			usage: "UserMention|UserID",
			example: "246302641930502145",
			args: { user: { as: "user" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		bot.users.fetch(args.user || message.author.id).then(user => {
			request({ uri: `http://api.discorddungeons.me/v3/user/${user.id}`, headers: { Authorization: process.env.API_DISCORDRPG } }, (err, response, body) => {
				if (err) throw err;
				if (response.statusCode === 404) {
					message.reply(
						"it looks like the user you specified has not started his adventure on DiscordRPG yet."
					);
				} else if (response.statusCode === 200) {
					const { data } = JSON.parse(body);
					const maxpoints = data.level * 5;
					const skillinfo = data.skills;
					const attribs = data.attributes;

					const axe = (data.tool.axe || "370").includes(":") ? undefined : data.tool.axe;
					const axebonus = itemList[axe || "370"].itemBoost || 0;
					const lumbercurrent = Math.floor((
						((attribs.lumberBoost / 25) + 1) + skillinfo.chop.level)
					+ axebonus);
					const lumbermax = Math.floor(
						(((maxpoints / 25) + 1) + skillinfo.chop.level) + axebonus
					);
					const pickaxe = (data.tool.pickaxe || "370").includes(":") ? undefined : data.tool.pickaxe;
					const pickbonus = itemList[pickaxe || "369"].itemBoost || 0;
					const miningCurrent = 1 + skillinfo.mine.level
						+ Math.floor(attribs.mineBoost / 40) + pickbonus;
					const miningMax = 1 + skillinfo.mine.level
						+ Math.floor(maxpoints / 40);
					const essenceMax = 1 + skillinfo.mine.level
						+ Math.floor(maxpoints / 100) + pickbonus;
					const forageCurrent = 1 + skillinfo.forage.level
						+ Math.floor(attribs.scavenge / 65);
					const forageMax = 1 + skillinfo.forage.level
						+ Math.floor(maxpoints / 65);

					const xpCalc = level => [
						Math.round(Math.sqrt((Math.sqrt(level) * 0.25) * 15 / 2)),
						Math.round(Math.sqrt((Math.sqrt(level) * 0.25) * 5 / 2))
					];
					const xp = level => {
						const [max, min] = xpCalc(level);
						return `You would get between **${min} and ${max} skill XP**.`;
					};
					const mineXp = level => {
						const [max, min] = xpCalc(level);
						const minMin = min + Math.floor(attribs.mineBoost / 125);
						const minMax = max + Math.floor(attribs.mineBoost / 125);
						const maxMin = min + Math.floor(maxpoints / 125);
						const maxMax = max + Math.floor(maxpoints / 125);
						return `With your current mining boosts skills, you would get between **${minMin} and ${minMax} skill XP**.\nWith the highest mining boosts skills, you would get between **${maxMin} and ${maxMax} skill XP**.`;
					};
					const embed = new MessageEmbed()
						.setAuthor(`${user.username}  |  Skills`, user.avatarURL())
						.setColor(0x00AE86)
						.addField("Mining", `**Level ${skillinfo.mine.level}** (${Number.formatNumber(skillinfo.mine.xp)} XP)\nWith your **current** mining boost skills, you would get **${miningCurrent} ores or essences**.\nWith the **highest** mining boost skills, you would get **${miningMax} ores**, or between **${essenceMax} and ${miningMax} essences**.\n${mineXp(skillinfo.mine.level)}`)
						.addField("Chopping", `**Level ${skillinfo.chop.level}** (${Number.formatNumber(skillinfo.chop.xp)} XP)\nWith your **current** lumber boost skills, you would get **${lumbercurrent} logs**.\nWith the **highest** lumber boost skills, you would get **${lumbermax} logs**.\n${xp(skillinfo.chop.level)}`)
						.addField("Foraging", `**Level ${skillinfo.forage.level}** (${Number.formatNumber(skillinfo.forage.xp)} XP)\nWith your **current** scavenging skills, you would get **${forageCurrent} items**.\nWith the **highest** scavenging skills, you would get **${forageMax} items**.\n${xp(skillinfo.forage.level)}`)
						.addField("Fishing", `**Level ${skillinfo.fish.level}** (${Number.formatNumber(skillinfo.fish.xp)} XP)\n${xp(skillinfo.fish.level)}`);
					message.channel.send(embed);
				}
			});
		}).catch(() => { message.channel.error("INVALID_USER"); });
	}

	registerCheck() {
		return process.env.API_DISCORDRPG !== undefined
			&& process.env.API_DISCORDRPG !== null;
	}
};
