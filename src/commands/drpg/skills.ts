import request from "request";
import Command from "../../groups/DRPGCommand.js";
import { formatNumber } from "../../utils/Methods.js";
import Client from "../../structures/Client.js";
import { drpgItems } from "../../utils/Constants.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class SkillsCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Displays users' skills information",
			example: "246302641930502145",
			args: { user: {
				as: "user",
				desc: "The user whose skills you want to see",
				optional: true
			} }
		});
	}

	run(ctx: MessageContext) {
		const args = ctx.args as { user: string };
		ctx.client.users.fetchDiscord(args.user || ctx.author.id).then(user => {
			request({ uri: `http://api.discorddungeons.me/v3/user/${user.id}`, headers: { Authorization: process.env.API_DISCORDRPG } }, (err, response, body) => {
				if (err) throw err;
				if (response.statusCode === 404) {
					ctx.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
				} else if (response.statusCode === 200) {
					const { data } = JSON.parse(body);
					const maxpoints = data.level * 5;
					const skillinfo = data.skills;
					const attribs = data.attributes;

					const axe = (data.tool.axe || "370").includes(":") ? undefined : data.tool.axe;
					const axebonus = drpgItems[axe || "370"].itemBoost || 0;
					const lumbercurrent = Math.floor((
						((attribs.lumberBoost / 25) + 1) + skillinfo.chop.level)
					+ axebonus);
					const lumbermax = Math.floor(
						(((maxpoints / 25) + 1) + skillinfo.chop.level) + axebonus
					);
					const pickaxe = (data.tool.pickaxe || "370").includes(":") ? undefined : data.tool.pickaxe;
					const pickbonus = drpgItems[pickaxe || "369"].itemBoost || 0;
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

					const xpCalc = (level: number) => [
						Math.round(Math.sqrt((Math.sqrt(level) * 0.25) * 15 / 2)),
						Math.round(Math.sqrt((Math.sqrt(level) * 0.25) * 5 / 2))
					];
					const xp = (level: number) => {
						const [max, min] = xpCalc(level);
						return `You would get between **${min} and ${max} skill XP**.`;
					};
					const mineXp = (level: number) => {
						const [max, min] = xpCalc(level);
						const minMin = min + Math.floor(attribs.mineBoost / 125);
						const minMax = max + Math.floor(attribs.mineBoost / 125);
						const maxMin = min + Math.floor(maxpoints / 125);
						const maxMax = max + Math.floor(maxpoints / 125);
						return `With your current mining boosts skills, you would get between **${minMin} and ${minMax} skill XP**.\nWith the highest mining boosts skills, you would get between **${maxMin} and ${maxMax} skill XP**.`;
					};
					const embed = this.createEmbed(ctx)
						.setAuthor({
							name: `${user.username}  |  Skills`,
							iconURL: user.avatarURL
						})
						.addField("Mining", `**Level ${skillinfo.mine.level}** (${formatNumber(skillinfo.mine.xp)} XP)\nWith your **current** mining boost skills, you would get **${miningCurrent} ores or essences**.\nWith the **highest** mining boost skills, you would get **${miningMax} ores**, or between **${essenceMax} and ${miningMax} essences**.\n${mineXp(skillinfo.mine.level)}`)
						.addField("Chopping", `**Level ${skillinfo.chop.level}** (${formatNumber(skillinfo.chop.xp)} XP)\nWith your **current** lumber boost skills, you would get **${lumbercurrent} logs**.\nWith the **highest** lumber boost skills, you would get **${lumbermax} logs**.\n${xp(skillinfo.chop.level)}`)
						.addField("Foraging", `**Level ${skillinfo.forage.level}** (${formatNumber(skillinfo.forage.xp)} XP)\nWith your **current** scavenging skills, you would get **${forageCurrent} items**.\nWith the **highest** scavenging skills, you would get **${forageMax} items**.\n${xp(skillinfo.forage.level)}`)
						.addField("Fishing", `**Level ${skillinfo.fish.level}** (${formatNumber(skillinfo.fish.xp)} XP)\n${xp(skillinfo.fish.level)}`);
					ctx.reply(embed);
				}
			});
		}).catch(() => { ctx.error("INVALID_USER"); });
	}
}
