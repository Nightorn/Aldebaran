import { Mode, User } from "nodesu";
import { Command, Embed } from "../../groups/OsuCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import { OsuMode } from "../../utils/Constants.js";

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

export default class OsuCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows the osu! stats of the user specified",
			help: "Run the command with the osu! username of the user you want to see the stats of, or maybe their user ID and the according mode (osu, mania, taiko, ctb).\n**Supported Modes** : **osu!standard** : (by default), --osu; **osu!taiko**: --taiko; **osu!ctb**: --ctb; **osu!mania**: --mania.",
			example: "Ciborn --mania",
			aliases: ["osuprofile"],
			args: {
				user: { as: "word", desc: "Username/UserID", optional: true },
				mode: { as: "mode", optional: true }
			}
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { user?: string, mode?: string };
		const client = ctx.client.nodesu!;
		const author = await ctx.author();
		const mode = (args.mode || author.settings.osumode || "osu") as OsuMode;
		if (Mode[mode] !== undefined) {
			client.user.get(
				args.user
				|| author.settings.osuusername
				|| author.username,
				Mode[mode]
			).then(data => {
				const user = new User(data);
				const plays = f(
					user.countRankSS
					+ user.countRankSSH
					+ user.countRankS
					+ user.countRankSH
					+ user.countRankA
				);

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
				ctx.reply(embed);
			}).catch(err => {
				console.error(err);
				ctx.reply("the user you specified does not exist, or at least in the mode specified.");
			});
		} else {
			ctx.reply("the mode you specified does not exist. Check `&?osu` for more informations.");
		}
	}
};
