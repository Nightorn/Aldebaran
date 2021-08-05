import Nodesu from "nodesu";
import { Command, Embed } from "../../groups/OsuCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class OsuProfileCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows the osu! stats of the user specified",
			help: "Run the command with the osu! username of the user you want to see the stats of, or maybe their user ID and the according mode (osu, mania, taiko, ctb).\n**Supported Modes** : **osu!standard** : (by default), --osu; **osu!taiko**: --taiko; **osu!ctb**: --ctb; **osu!mania**: --mania.",
			example: "Ciborn --mania",
			aliases: ["osuprofile"],
			args: {
				user: { as: "word", desc: "Username/UserID" },
				mode: { as: "mode" }
			}
		});
	}

	run(_: AldebaranClient, message: Message, args: any) {
		const client = new Nodesu.Client(process.env.API_OSU!);
		const mode = args.mode as string || message.author.settings.osumode || "osu";
		if (Nodesu.Mode[mode as "osu" | "taiko" | "ctb" | "mania"] !== undefined) {
			client.user.get(args.user || message.author.settings.osuusername,
				Nodesu.Mode[mode as "osu" | "taiko" | "ctb" | "mania"]).then((data: any) => {
				const f = (x: number | string) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				const t = (x: number) => {
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
				const plays = f(user.countRankSS + user.countRankSSH + user.countRankS + user.countRankSH + user.countRankA);
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
						`Hits (${f(user.count300 + user.count100 + user.count50)})`,
						`**300 Count**: ${t(user.count300)}\n**100 Count** : ${t(
							user.count100
						)}\n**50 Count**: ${t(user.count50)}`,
						true
					)
					.addField(
						`Ranks Achieved (${plays})`,
						`**SS+ / SS**: **${f(
							user.countRankSS + user.countRankSSH
						)}** (${f(user.countRankSSH)} / ${f(
							user.countRankSS
						)})\n**S+ / S**: **${f(
							user.countRankS + user.countRankSH
						)}** (${f(user.countRankSH)} / ${f(
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
