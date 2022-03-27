import { Beatmap, Mode, User, UserScore } from "nodesu";
import ojsama from "ojsama";
import ppv2Results, { Result } from "../../utils/osu!/ppv2Results.js";
import { Command, Embed } from "../../groups/OsuCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { OsuMode } from "../../utils/Constants.js";

type Score = {
	id: number,
	user: number,
	link: string,
	pp: string,
	rank: string,
	artist: string,
	title: string,
	diff: string,
	mapper: string,
	sr: string,
	mods: string,
	score: number,
	combo: number,
	maxcombo: number,
	nmiss: number,
	n300: number,
	n100: number,
	n50: number,
	acc: number | null
};

const ranks = {
	SH: "S+",
	X: "SS",
	XH: "SS+"
};

const f = (x: string | number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default class OsubestCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays the 5 best osu! plays of the specified user",
			help: "Run the command with the osu! username of the user you want to see the stats of, or maybe their user ID and the according mode (osu, mania, taiko, ctb).\n**Supported Modes** : **osu!standard** : (by default), --osu; **osu!taiko**: --taiko; **osu!ctb**: --ctb; **osu!mania**: --mania.",
			example: "Ciborn",
			aliases: ["osutop"],
			args: {
				user: { as: "string", desc: "Username/UserID", optional: true },
				mode: {
					as: "mode",
					choices: [["osu!", "osu"], ["osu!mania", "mania"], ["osu!ctb", "ctb"], ["osu!taiko", "taiko"]],
					desc: "osu! Mode",
					optional: true
				}
			}
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { user?: string, mode?: string };
		const client = ctx.client.nodesu!;
		const mode = (args.mode || ctx.author.settings.osumode || "osu") as OsuMode;
		if (Mode[mode] !== undefined) {
			client.user.getBest(
				args.user
				|| ctx.author.settings.osuusername
				|| ctx.author.username,
				Mode[mode], 5
			).then(async (data: any) => {
				const best = data.reduce(
					(acc: UserScore[], cur: object) => [...acc, new UserScore(cur)], []
				);
				const user = new User(await client.user.get(best[0].userId));

				const beatmapQueries: Promise<object[] | Beatmap[]>[] = [];
				for (const map of best) {
					beatmapQueries.push(
						client.beatmaps.getByBeatmapId(map.beatmapId,
							Mode[mode], 1, 1, map.enabledMods)
					);
				}

				Promise.all(beatmapQueries).then(maps => {
					const beatmaps: Beatmap[] = [];
					const scores: Score[] = [];
					const accuracyQueries: Promise<Result>[] = [];
					if (mode === "osu") {
						for (let i = 0; i < best.length; i++) {
							accuracyQueries.push(ppv2Results(
								best[i].beatmapId,
								best[i].enabledMods!,
								best[i].maxCombo,
								undefined,
								Number(best[i].countMiss),
								Number(best[i].count300),
								Number(best[i].count100),
								Number(best[i].count50)
							));
							beatmaps.push(new Beatmap(maps[i][0]));
						}
					}
					Promise.all(accuracyQueries).then(async accuracies => {
						for (let i = 0; i < beatmaps.length; i++) {
							scores.push({
								id: beatmaps[i].beatmapId,
								user: best[i].userId,
								link: `https://osu.ppy.sh/b/${beatmaps[i].beatmapId}`,
								pp: Number(best[i].pp).toFixed(2),
								rank: ranks[best[i].rank as "SH" | "X" | "XH"] || best[i].rank,
								artist: beatmaps[i].artist,
								title: beatmaps[i].title,
								diff: beatmaps[i].version,
								mapper: beatmaps[i].creator,
								sr: Number(beatmaps[i].difficultyRating).toFixed(2),
								mods: ojsama.modbits.string(best[i].enabledMods!),
								score: best[i].score,
								combo: best[i].maxCombo,
								maxcombo: beatmaps[i].maxCombo,
								nmiss: best[i].countMiss,
								n300: best[i].count300,
								n100: best[i].count100,
								n50: best[i].count50,
								acc: mode === "osu" ? accuracies[i].accuracy : null
							});
						}
						let description = "";
						for (const s of scores) {
							description += `[__${s.artist} - **${s.title}**__ [${s.diff}]](${s.link}) (${s.mapper}) [**${s.sr}★${s.mods !== "" ? ` +${s.mods}` : ""}**]\n**\`[${s.rank}]\`** (${mode === "osu" ? `**${s.acc}%**, ` : ""}**x${s.combo}**${["osu", "ctb"].includes(mode) ? `/${s.maxcombo}` : ""}) - **${f(s.pp)}pp** - \`${s.n300}\` 300, \`${s.n100}\` 100, \`${s.n50}\` 50, \`${s.nmiss}\` miss\n\n`;
						}
						const embed = new Embed(this)
							.setAuthor(`${user.username}  |  Top 5 Best Plays  |  osu!${mode === "osu" ? "" : mode}`,
								`https://a.ppy.sh/${user.userId}`,
								`https://osu.ppy.sh/users/${user.userId}`)
							.setDescription(description);
						if (mode !== "osu") embed.setFooter("Because this is not an osu!standard map, some information about the scores are unavailable.");
						ctx.reply(embed);
					});
				});
			}).catch(err => {
				console.log(err);
				ctx.reply("the user you specified does not exist, or at least in the mode specified.");
			});
		} else {
			ctx.reply("the mode you specified does not exist. Check `&?osu` for more information.");
		}
	}
};
