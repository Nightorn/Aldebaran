import { Beatmap, Converts, Mode, User, UserScore } from "nodesu";
import ojsama from "ojsama";
import ppv2Results, { Result } from "../../utils/osu!/ppv2Results.js";
import { Command, Embed } from "../../groups/OsuCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import { OsuMode } from "../../utils/Constants.js";

const ranks = {
	SH: "S+",
	X: "SS",
	XH: "SS+"
};

const f = (number: number) => String(number).length === 1 ? `0${number}` : number;
const parseDate = (date: Date) => {
	return `${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())} at ${f(date.getHours())}:${f(date.getMinutes())} UTC`;
};

export default class OsurecentCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays the most recent play of the specified user",
			help: "Run the command with the osu! username of the user you want to see the stats of, or maybe their user ID and the according mode (osu, mania, taiko, ctb).\n**Supported Modes** : **osu!standard** : (by default), --osu; **osu!taiko**: --taiko; **osu!ctb**: --ctb; **osu!mania**: --mania.",
			example: "Ciborn",
			aliases: ["osurs"],
			args: {
				user: { as: "word", desc: "Username/UserID" },
				mode: { as: "mode" }
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as { user?: string, mode?: string };
		const author = await ctx.author();
		const client = ctx.client.nodesu!;
		const mode = (args.mode || author.settings.osumode || "osu") as OsuMode;
		if (Mode[mode] !== undefined) {
			client.user.getRecent(
				args.user
				|| author.settings.osuusername
				|| author.username,
				Mode[mode],
				1
			).then(async data => {
				const recent = new UserScore(data[0]);
				const user = new User(await client.user
					.get(recent.userId, Mode[mode]));

				const mapData = (await client.beatmaps.getByBeatmapId(
					recent.beatmapId,
					Mode[mode],
					1,
					Converts.include,
					recent.enabledMods
				))[0];
				const map = new Beatmap(mapData);
				let score: Result | null = null;
				if (mode === "osu") {
					score = await ppv2Results(
						recent.beatmapId,
						recent.enabledMods!,
						recent.maxCombo,
						undefined,
						recent.countMiss,
						recent.count300,
						recent.count100,
						recent.count50
					);
				}
				const mods = ojsama.modbits.string(Number(recent.enabledMods));
				const completion = (
					(recent.count300
					+ recent.count100
					+ recent.count50
					+ recent.countMiss)
				* 100 / (map.countNormal + map.countSlider + map.countSpinner))
					.toFixed(2);
				const embed = new Embed(this)
					.setAuthor(`${user.username}  |  Most Recent osu!${mode !== "osu" ? mode : ""} Play`,
						`https://a.ppy.sh/${user.userId}`,
						`https://osu.ppy.sh/users/${user.userId}`)
					.setTitle(`__${map.artist} - **${map.title}**__ [${map.version}] (${map.creator}) [**${Number(map.difficultyRating).toFixed(2)}★${mods !== "" ? ` +${mods}` : ""}]**`)
					.setURL(`https://osu.ppy.sh/b/${recent.beatmapId}`)
					.setDescription(`**\`[${ranks[recent.rank as "XH" | "X" | "SH"] || recent.rank}]\`** (${mode === "osu" ? `**${score!.accuracy}%**, ` : ""}**x${recent.maxCombo}**${["osu", "ctb"].includes(mode) ? `/${map.maxCombo}` : ""}) -${mode === "osu" ? ` **${score!.pp.toFixed(2)}pp** -` : ""} \`${recent.count300}\` 300, \`${recent.count100}\` 100, \`${recent.count50}\` 50, \`${recent.countMiss}\` miss${recent.rank === "F" ? `\n**${completion}%** Map Completion` : ""}`)
					.setFooter(`Score set on ${parseDate(recent.date)}.`);
				ctx.reply(embed);
			}).catch(err => {
				ctx.reply("the user you specified does not exist, or at least in the mode specified.");
				console.error(err);
			});
		} else {
			ctx.reply("the mode you specified does not exist. Check `&?osu` for more informations.");
		}
	}
};
