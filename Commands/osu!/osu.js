const Nodesu = require("nodesu");
const { Command, Embed } = require("../../structures/categories/OsuCategory");

module.exports = class OsuProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: "osu",
			description: "Shows the osu! stats of the user specified",
			usage: "Username/UserID Mode",
			example: "Ciborn --mania",
			aliases: ["osuprofile"]
		});
	}

	run(bot, message, args) {
		const client = new Nodesu.Client(bot.config.apikeys["osu!"]);
		if (args.length > 0 ? args[0] === "?" : false) {
			const embed = new Embed(this)
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Documentation for the osu! (User Profile) command")
				.setDescription(
					"First, you have to run the command with the osu! username of the user you want to see the stats of, or eventually his user ID. After that, you can choose the mode to show stats from, note that the default mode is standard."
				)
				.addField(
					"Supported Modes",
					"**osu!standard** : BY DEFAULT, --osu\n**osu!taiko** : --taiko\n**osu!ctb** : --ctb\n**osu!mania** : --mania"
				);
			message.channel.send({ embed });
		} else {
			let mode = message.author.settings.osuMode || "osu";
			for (const i in args) {
				if (args[i].indexOf("--") === 0) {
					mode = args[i].replace("--", "");
					args.splice(i, 1);
				}
			}
			if (Nodesu.Mode[mode] !== undefined) {
				client.user
					.get(args[0] || message.author.settings.osuUsername,
						Nodesu.Mode[mode])
					.then(data => {
						const f = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						const i = x => parseInt(x, 10);
						const t = x => {
							const s = x.toString();
							const l = s.length;
							if (l > 9) {
								return `${f(s.substr(0, l - 6))}m`;
							}
							if (l > 6) {
								return `${f(s.substr(0, l - 3))}k`;
							}
							return f(x);
						};
						const user = new Nodesu.User(data);
						const plays = f(i(user.countRankSS)
							+ i(data.count_rank_ssh) + i(user.countRankS)
							+ i(data.count_rank_sh) + i(user.countRankA));
						const embed = new Embed(this)
							.setAuthor(`${user.username}  |  ${user.pp !== 0 ? `#${f(user.rank)} (${f(user.pp.toFixed(2))}pp)` : "Unranked"}  |  osu!${mode === "osu" ? "" : mode}`, `https://a.ppy.sh/${user.id}`, `https://osu.ppy.sh/users/${user.id}`)
							.addField("Progression", `**Level ${Math.floor(user.level)}** (${((user.level % 1) * 100).toFixed(2)}%)`, true)
							.addField("Hit Accuracy", `${user.accuracy.toFixed(2)}%`, true)
							.addField("Country Rank", `${user.country !== "" ? `:flag_${user.country.toLowerCase()}:` : "No Country"}឵឵ ឵឵឵឵ ឵឵${user.pp !== 0 ? `#${f(user.countryRank)}` : "Unranked"}`, true)
							.addField(
								"Statistics",
								`**Play Count**: ${f(user.playcount)}\n**Ranked Score**: ${t(
									user.rankedScore
								)}\n**Total Score**: ${t(user.totalScore)}`,
								true
							)
							.addField(
								`Hits (${f(i(user.count300) + i(user.count100) + i(user.count50))})`,
								`**300 Count**: ${t(user.count300)}\n**100 Count** : ${t(
									user.count100
								)}\n**50 Count**: ${t(user.count50)}`,
								true
							)
							.addField(
								`Ranks Achieved (${plays})`,
								`**SS+ / SS**: **${f(
									i(user.countRankSS) + i(data.count_rank_ssh)
								)}** (${f(data.count_rank_ssh)} / ${f(
									user.countRankSS
								)})\n**S+ / S**: **${f(
									i(user.countRankS) + i(data.count_rank_sh)
								)}** (${f(data.count_rank_sh)} / ${f(
									user.countRankS
								)})\n**A**: **${f(user.countRankA)}**`,
								true
							);
						message.channel.send({ embed });
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
