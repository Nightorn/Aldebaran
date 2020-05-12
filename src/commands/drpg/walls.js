const { MessageEmbed } = require("discord.js");
const request = require("request");
const bases = require("../../../assets/data/bases.json");
const { Command } = require("../../groups/DRPGCommand");

module.exports = class WallsCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays user's wall informations",
			usage: "UserMention|UserID",
			example: "246302641930502145",
			args: { user: { as: "user" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message, args) {
		function calcWall(lvl, base, prevWall) {
			const L = parseInt(lvl, 10);
			const B = parseInt(base, 10);
			const C = prevWall ? parseInt(prevWall, 10) : 25;
			return L * (B + C) + L ** 2 * (B - C);
		}
		function findKeyAbove(lvl) {
			let level = lvl;
			let loops = 0; // prevent timeout
			while (bases[level] === undefined) {
				level++;
				loops++;
				if (loops > 50000) {
					throw new Error("The level you entered was too high, command timed out.");
				}
			}
			return level;
		}
		function findKeyBelow(lvl) {
			let level = lvl;
			let loops = 0;
			while (bases[level] === undefined && level > 0) {
				level--;
				loops++;
				if (loops > 50000) {
					throw new Error("The level you entered was too high, command timed out.");
				}
			}
			return level;
		}
		function userWall(msg, lvl) {
			try {
				const baseLvl = findKeyAbove(lvl);
				const prevBaseLvl = findKeyBelow(lvl - 1);

				const base = bases[baseLvl];
				let prevBase = 0;
				if (!bases[prevBaseLvl]) {
					prevBase = 25;
				} else {
					prevBase = bases[prevBaseLvl];
				}
				const wall = calcWall(baseLvl, base, prevBase);

				return [wall, parseInt(baseLvl, 10)];
			} catch (e) {
				msg.reply(e.msg);
				throw e;
			}
		}
		function calcXPNeeded(base, lvl) {
			return base * (lvl ** 2 + lvl);
		}

		try {
			const user = await bot.users.fetch(args.user || message.author.id);
			request({
				uri: `http://api.discorddungeons.me/v3/user/${user.id}`,
				headers: { Authorization: process.env.API_DISCORDRPG }
			}, (err, res, body) => {
				if (err) throw err;
				let data;
				try {
					data = JSON.parse(body);
				} catch (e) {
					message.reply("the DiscordRPG API seems down, please retry later.");
					return;
				}
				if (data.status === 404) {
					message.reply(
						"It looks like the player you mentioned hasn't started their adventure on DiscordRPG."
					);
					return;
				}
				data = data.data;

				const [wall, baseLvl] = userWall(message, data.level);
				const userAtWall = data.level === baseLvl;
				const xpNeeded = calcXPNeeded(bases[baseLvl], baseLvl);
				const wallProgress = xpNeeded - data.xp;

				const embed = new MessageEmbed()
					.setColor(0x00ae86)
					.setAuthor(`${user.username}  |  DiscordRPG Walls`,
						user.displayAvatarURL())
					.addField(
						`Base at Level ${baseLvl}`,
						`The baseXP (the increment of XP needed to level up - the "XP ramp") for Level ${baseLvl} is ${bases[baseLvl]}.`
					);

				if (userAtWall) {
					embed.addField(
						`Level ${baseLvl} wall`,
						`They're at a ${wall.toLocaleString("en-US")} XP wall.`
					);
					embed.addField(
						`${user.username}'s progress`,
						`**${Number.formatNumber(wall - wallProgress)} XP** / ${Number.formatNumber(wall)} XP (**${Math.round(
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
				message.channel.send({ embed });
			});
		} catch (err) {
			const [wall, baseLvl] = userWall(message, args[0]);
			const xpNeeded = calcXPNeeded(bases[baseLvl], baseLvl);

			const embed = new MessageEmbed()
				.setColor(0x00ae86)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle(`Wall closest to Level ${args[0]}`)
				.addField(
					`Base at Level ${baseLvl}`,
					`The baseXP (the increment of XP needed to level up - the "XP ramp") for Level ${baseLvl} is ${bases[baseLvl]}.`
				)
				.addField(
					`Level ${baseLvl} wall`,
					`The wall at Level ${baseLvl} is ${wall.toLocaleString(
						"en-US"
					)} XP. You will need ${xpNeeded.toLocaleString(
						"en-US"
					)} XP total to progress at that level.`
				);
			message.channel.send({ embed });
		}
	}
};
