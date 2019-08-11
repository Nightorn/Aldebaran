const { MessageEmbed } = require("discord.js");
const Nodesu = require("nodesu");
const oppai = require("oppai");
const retrieveBeatmapFile = require("../../functions/osu!/retrieveBeatmapFile");
const computeMods = require("../../functions/osu!/computeMods");
const { Command } = require("../../structures/categories/OsuCategory");

module.exports = class OsubestCommand extends Command {
	constructor(client) {
		super(client, {
			name: "osubest",
			description: "Displays the 5 best osu! plays of the specified user",
			usage: "Username/ID",
			example: "Ciborn",
			aliases: ["osutop"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const { config } = bot;
		const client = new Nodesu.Client(config.apikeys["osu!"]);
		if (args.length === 0) {
			return message.channel.send(
				"You need to specify the name of the user you want to the stats. Check `&osu ?` for more informations."
			);
		}
		if (args[0].toLowerCase() === "?") {
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Documentation for the osu! (User Profile) command")
				.setDescription(
					"First, you have to run the command with the osu! username of the user you want to see the stats, or eventually his user ID. After that, you can choose the mode to show stats from, note that the default mode is standard."
				)
				.addField(
					"Supported Modes",
					"**osu!standard** : BY DEFAULT, --osu\n**osu!taiko** : --taiko\n**osu!ctb** : --ctb\n**osu!mania** : --mania"
				)
				.setColor("BLUE");
			message.channel.send({ embed });
		} else {
			const ranks = {
				SH: "S+",
				X: "SS",
				XH: "SS+"
			};
			let mode = "osu";
			for (const element of args) { if (element.indexOf("--") === 0) mode = element.replace("--", ""); }
			if (Nodesu.Mode[mode] !== undefined) {
				client.user
					.getBest(args[0], Nodesu.Mode[mode], 5)
					.then(async data => {
						const f = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						const ctx = oppai.Ctx();
						const maps = [];
						let list = "";
						for (const score of data) {
							retrieveBeatmapFile(score.beatmap_id);
							const b = oppai.Beatmap(ctx);
							const buf = oppai.Buffer(2000000);
							const dctx = oppai.DiffCalcCtx(ctx);
							b.parse(
								`./cache/osu!/${score.beatmap_id}.osu`,
								buf,
								2000000,
								true
							);
							b.applyMods(score.enabled_mods);
							const diff = dctx.diffCalc(b);
							const res = ctx.ppCalc(
								diff.aim,
								diff.speed,
								b,
								oppai.nomod,
								parseInt(score.maxcombo, 10),
								parseInt(score.countmiss, 10),
								parseInt(score.count300, 10),
								parseInt(score.count100, 10),
								parseInt(score.count50, 10)
							);
							score.accuracy = res.accPercent;
							score.stars = diff.stars;
							maps.push(score);
						}

						const fetchMapMetadata = async mapsList => {
							const results = [];
							for (const map of mapsList) {
								results.push(
									client.beatmaps.getByBeatmapId(
										map.beatmap_id,
										Nodesu.Mode[mode],
										1,
										true
									)
								);
							}
							return Promise.all(results);
						};
						fetchMapMetadata(maps)
							.then(async mapsData => {
								for (const i in mapsData) {
									const map = maps[i];
									const metadata = mapsData[i][0];
									const mods = computeMods.run(parseInt(map.enabled_mods, 10));
									list += `**\`[${
										ranks[map.rank] === undefined ? map.rank : ranks[map.rank]
									}]\` ${f(map.pp)}pp** | [__${metadata.artist} - **${
										metadata.title
									}**__ [${metadata.version}]](https://osu.ppy.sh/b/${
										map.beatmap_id
									}) (**${Math.round(parseFloat(map.stars) * 100)
                    / 100}★ +${mods.join("")}**)\n**Score** \`${f(
										map.score
									)}\` | **Accuracy** ${Math.round(map.accuracy * 100)
                    / 100}% | **300** \`${f(map.count300)}\` | **100** \`${
										map.count100
									}\` | **50** \`${map.count50}\` | **Misses** \`${
										map.countmiss
									}\`\n\n`;
								}
								const user = await client.user.get(
									maps[0].user_id,
									Nodesu.Mode[mode]
								);
								const embed = new MessageEmbed()
									.setAuthor(
										`${user.username}'s 5 best plays`,
										`https://a.ppy.sh/${user.user_id}`,
										`https://osu.ppy.sh/users/${user.user_id}`
									)
									.setDescription(list)
									.setColor("#cc5288");
								message.channel.send({ embed });
							})
							.catch(() => {});
					})
					.catch(() => {
						message.reply(
							"the user you specified does not exist, or at least in the mode specified."
						);
					});
			} else {
				message.reply(
					"the mode you specified does not exist. Check `&osu ?` for more informations."
				);
			}
		}
		return true;
	}
};
