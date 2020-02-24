const Nodesu = require("nodesu");
const { Command, Embed } = require("../../groups/OsuCommand");

module.exports = class OsuProfileCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Shows the osu! stats of the user specified",
			help: "Run the command with the osu! username of the user you want to see the stats of, or maybe their user ID and the according mode (osu, mania, taiko, ctb).\n**Supported Modes** : **osu!standard** : (by default), --osu; **osu!taiko**: --taiko; **osu!ctb**: --ctb; **osu!mania**: --mania.",
			usage: "Username/UserID Mode",
			example: "Ciborn --mania",
			aliases: ["osuprofile"],
			args: { user: { as: "user" }, mode: { as: "mode" } }
		});
	}

	run(bot, message, args) {
		const client = new Nodesu.Client(bot.config.apikeys["osu!"]);
		const mode = args.mode || message.author.settings.osuMode || "osu";
		if (Nodesu.Mode[mode] !== undefined) {
			client.user.get(args.user || message.author.settings.osuUsername,
				Nodesu.Mode[mode]).then(data => {
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
