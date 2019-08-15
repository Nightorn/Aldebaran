const { MessageEmbed } = require("discord.js");
const request = require("request");
const { Command } = require("../../structures/categories/DRPGCategory");
const userCheck = require("../../functions/action/userCheck");

module.exports = class SkillsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "skills",
			description: "Displays users' skills informations",
			usage: "UserMention|UserID",
			example: "246302641930502145"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		userCheck(bot, message, args).then(usrid => {
			request({ uri: `http://api.discorddungeons.me/v3/user/${usrid}`, headers: { Authorization: bot.config.drpg_apikey } }, (err, response, body) => {
				if (err) return;
				const { data } = JSON.parse(body);
				if (data.error !== undefined) message.channel.send("**Error**: No User Profile Found.");
				else {
					const maxpoints = Math.floor(data.level * 5);
					const skillinfo = data.skills;
					const currentpoints = data.attributes;
					const { tool } = data;
					let axebonus = 0;
					if (tool.axe === "370") axebonus = 0;
					else if (tool.axe === "413") axebonus += 1;
					else if (tool.axe === "415") axebonus += 3;
					else if (tool.axe === "416") axebonus += 5;
					else if (tool.axe === "417") axebonus += 8;
					else axebonus = 0;
					const lumbercurrent = Math.floor((
						((currentpoints.lumberBoost / 25) + 1) + skillinfo.chop.level)
					+ axebonus);
					const lumbermax = Math.floor(
						(((maxpoints / 25) + 1) + skillinfo.chop.level) + axebonus
					);

					const embed = new MessageEmbed()
						.setAuthor(`${message.author.username}  |  Skills`, message.author.avatarURL())
						.setColor(0x00AE86)
						.addField("Chopping", `**Level ${skillinfo.chop.level}** (${Number.formatNumber(skillinfo.chop.xp)} XP)\nWith your **current** lumber boost skills, you would get **${lumbercurrent} logs**.\nWith the **highest** lumber boost skills, you would get **${lumbermax} logs**.`);
					message.channel.send(embed);
				}
			});
		}).catch(() => {
			message.reply("Error you must enter a valid UserID or User Mention");
		});
	}

	registerCheck() {
		return this.client.config.drpg_apikey !== undefined
			&& this.client.config.drpg_apikey !== null;
	}
};
