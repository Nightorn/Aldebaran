const Nodesu = require("nodesu");
const ojsama = require("ojsama");
const ppv2Results = require("../../functions/osu!/ppv2Results");
const { Command, Embed } = require("../../structures/categories/OsuCategory");

module.exports = class OsubestCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays the 5 best osu! plays of the specified user",
			help: "Run the command with the osu! username of the user you want to see the stats of, or maybe their user ID and the according mode (osu, mania, taiko, ctb).\n**Supported Modes** : **osu!standard** : (by default), --osu; **osu!taiko**: --taiko; **osu!ctb**: --ctb; **osu!mania**: --mania.",
			usage: "Username/ID",
			example: "Ciborn",
			aliases: ["osutop"]
		});
	}

	run(bot, message, args) {
		const client = new Nodesu.Client(bot.config.apikeys["osu!"]);
		const ranks = {
			SH: "S+",
			X: "SS",
			XH: "SS+"
		};
		let mode = message.author.settings.osuMode || "osu";
		for (const i in args) {
			if (args[i].indexOf("--") === 0) {
				mode = args[i].replace("--", "");
				args.splice(i, 1);
			}
		}
		if (Nodesu.Mode[mode] !== undefined) {
			client.user.getBest(args[0] || message.author.settings.osuUsername,
				Nodesu.Mode[mode], 5)
				.then(async data => {
					const user = await client.user
						.get(data[0].user_id, Nodesu.Mode[mode]);
					const f = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					const beatmapQueries = [];
					for (const map of data) {
						beatmapQueries.push(
							client.beatmaps.getByBeatmapId(map.beatmap_id,
								Nodesu.Mode[mode], 1, 1, map.enabled_mods)
						);
					}
					Promise.all(beatmapQueries).then(maps => {
						const scores = [];
						const accuracyQueries = [];
						if (mode === "osu") {
							for (const s of data) accuracyQueries.push(
								ppv2Results(s.beatmap_id, s.enabled_mods, s.maxcombo,
									undefined, Number(s.countmiss), Number(s.count300),
									Number(s.count100), Number(s.count50))
							);
						}
						Promise.all(accuracyQueries).then(async accuracies => {
							for (const i in maps) {
								scores.push({
									id: maps[i][0].beatmap_id,
									user: data[i].user_id,
									link: `https://osu.ppy.sh/b/${maps[i][0].beatmap_id}`,
									pp: Number(data[i].pp).toFixed(2),
									rank: ranks[data[i].rank] || data[i].rank,
									artist: maps[i][0].artist,
									title: maps[i][0].title,
									diff: maps[i][0].version,
									mapper: maps[i][0].creator,
									sr: Number(maps[i][0].difficultyrating).toFixed(2),
									mods: ojsama.modbits.string(data[i].enabled_mods),
									score: data[i].score,
									combo: data[i].maxcombo,
									maxcombo: maps[i][0].max_combo,
									nmiss: data[i].countmiss,
									n300: data[i].count300,
									n100: data[i].count100,
									n50: data[i].count50,
									acc: mode === "osu" ? accuracies[i].accuracy : null
								});
							}
							let description = "";
							for (const s of scores) {
								description += `[__${s.artist} - **${s.title}**__ [${s.diff}]](${s.link}) (${s.mapper}) [**${s.sr}★${s.mods !== "" ? ` +${s.mods}` : ""}**]\n**\`[${s.rank}]\`** (${mode === "osu" ? `**${s.acc}%**, ` : ""}**x${s.combo}**${["osu", "ctb"].includes(mode) ? `/${s.maxcombo}` : ""}) - **${f(s.pp)}pp** - \`${s.n300}\` 300, \`${s.n100}\` 100, \`${s.n50}\` 50, \`${s.nmiss}\` miss\n\n`;
							}
							const embed = new Embed(this)
								.setAuthor(`${user.username}  |  Top 5 Best Plays  |  osu!${mode === "osu" ? "" : mode}`,
									`https://a.ppy.sh/${user.user_id}`,
									`https://osu.ppy.sh/users/${user.user_id}`)
								.setDescription(description);
							if (mode !== "osu") embed.setFooter("Because this is not an osu!standard map, some informations about the scores are unavailable.");
							message.channel.send({ embed });
						});
					});
				}).catch(() => {
					message.reply(
						"the user you specified does not exist, or at least in the mode specified."
					);
				});
		} else {
			message.reply(
				"the mode you specified does not exist. Check `&?osu` for more informations."
			);
		}
	}
};
