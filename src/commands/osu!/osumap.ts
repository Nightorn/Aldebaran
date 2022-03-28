import { ApprovalStatus, Beatmap, Converts, Mode } from "nodesu";
import ojsama from "ojsama";
import retrieveBeatmapFile from "../../utils/osu!/retrieveBeatmapFile.js";
import ppv2Results from "../../utils/osu!/ppv2Results.js";
import { Command, Embed } from "../../groups/OsuCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const supportedMods = ["NF", "EZ", "HT", "SO", "HR", "DT", "NC", "HD", "FL"];
const d = (x: number | string) => (x.toString().length === 1 ? `0${x}` : x);
const t = (x: number, l?: number) => x.toFixed(l === null ? 2 : l);
const r = (x: number) => Math.round(x * 100) / 100;
const returnDate = (x: Date) => `${d(x.getUTCMonth() + 1)}/${d(
	x.getUTCDay() + 1
)}/${x.getUTCFullYear()} ${d(x.getUTCHours())}:${d(x.getUTCMinutes())} UTC`;
const returnDuration = (x: number) => (x > 60
	? `${Math.floor(x / 60)}m${d(Math.floor(x % 60))}s`
	: `${Math.floor(x)}s`);

export default class OsumapCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows the information of the specified map",
			help: "First, you have to send the link of the beatmap you want to see the information of, or you also use its ID. After that, you can choose the mode to show the information from, note that the default mode is standard. See more information below. You can also specify with which mods you want to play, by adding `+` before, like that : `+HDDT`, specify the combo you want like `x666` or your accuracy with `69%`. The most completed command would be `osumap https://osu.ppy.sh/beatmapsets/627629#osu/1322507 +HDDT x2000 90%`. This command does not work with beatmapsets or by the name of beatmaps.",
			example: "1097541 --taiko +HD 97% 100x 69m",
			args: {
				map: { as: "expression", regex: /\d+$/, desc: "Beatmap URL / ID" },
				mode: {
					as: "mode",
					choices: [["osu!", "osu"], ["osu!mania", "mania"], ["osu!ctb", "ctb"], ["osu!taiko", "taiko"]],
					desc: "Game Mode (--osu, --mania, --ctb, --taiko)",
					optional: true
				},
				mods: {
					as: "expression",
					regex: /(\+(\D{2})+)/,
					desc: "Mods (ex: +HDDT)",
					optional: true
				},
				accuracy: {
					as: "expression",
					regex: /(\d{1,2}(\.\d{1,2})?%)/,
					desc: "Accuracy (ex: 98.95%)",
					optional: true
				},
				combo: {
					as: "expression",
					regex: /\d+(?=x)/,
					desc: "Combo (ex: 469x)",
					optional: true
				},
				nmiss: {
					as: "expression",
					regex: /\d+(?=m)/,
					desc: "Miss Amount (ex: 7m)",
					optional: true
				}
			}
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as {
			map: string,
			mode?: string,
			mods?: string,
			accuracy?: string,
			combo?: string,
			nmiss?: string
		};
		const client = ctx.client.nodesu!;
		if (args.map === undefined) {
			return ctx.reply(
				"You need to send a link of the beatmap or its ID. Check `&?osumap` for more information."
			);
		}
		const nmiss = args.nmiss || 0;
		const accuracy = args.accuracy ? args.accuracy.replace("%", "") : 98;
		const comboArg = args.combo;
		const mode = args.mode as keyof typeof Mode || "osu";
		const mods = args.mods ? (args.mods as string).replace("+", "")
			.split(/([A-Z]{2})/)
			.filter(v => v !== "" && supportedMods.includes(v)) : [];
		const stringMods = mods.join("");
		if (Mode[mode] !== undefined) {
			const beatmap = new Beatmap((await client.beatmaps.getByBeatmapId(
				args.map,
				Mode[mode],
				1,
				Converts.include,
				ojsama.modbits.from_string(stringMods)
			))[0]);
			if (beatmap) {
				const hitobjects = beatmap.countNormal
					+ beatmap.countSlider
					+ beatmap.countSpinner;
				retrieveBeatmapFile(beatmap.id).then(async () => {
					let approvalStatus = null;
					for (const [key, value] of Object.entries(ApprovalStatus)) {
						if (value === beatmap.approved)
							approvalStatus = key[0].toUpperCase() + key.slice(1);
					}
					const combo = comboArg || beatmap.maxCombo;
					let results = null;
					let resultsAcc = null;
					if (mode === "osu") {
						results = await ppv2Results(
							beatmap.id,
							ojsama.modbits.from_string(stringMods),
							beatmap.maxCombo,
							100,
							0
						);
						resultsAcc = await ppv2Results(
							beatmap.id,
							ojsama.modbits.from_string(stringMods),
							undefined,
							Number(accuracy),
							Number(nmiss)
						);
					}

					const embed = new Embed(this)
						.setAuthor(
							beatmap.creator,
							`https://a.ppy.sh/${beatmap.mapperId}`,
							`https://osu.ppy.sh/users/${beatmap.mapperId}`
						)
						.setTitle(
							`__${beatmap.artist} - **${beatmap.title}**__ [${beatmap.version}] (**\`${r(beatmap.difficultyRating)}\`★${mods.length === 0 ? "" : ` +${mods.join("")}`}**)`
						)
						.setDescription(
							`${
								beatmap.approvedDate === null
									? `**${approvalStatus}**  •  Last Updated on ${returnDate(
										new Date(beatmap.lastUpdate)
									)}`
									: `**${approvalStatus}** on ${returnDate(
										new Date(beatmap.approvedDate)
									)}`
							}\n${
								mode !== "osu"
									? "*Some data are unavailable as this is not a standard map.*"
									: ""
							}`
						)
						.setURL(
							`https://osu.ppy.sh/beatmapsets/${beatmap.setId}/#${mode}/${
								beatmap.id
							}`
						)
						.addField(
							"Map Length",
							`**Drain Time** : ${
								mods.indexOf("DT") !== -1 || mods.indexOf("NC") !== -1
									? returnDuration(beatmap.hitLength / 1.5)
									: returnDuration(beatmap.hitLength)
							}\n**Song Duration** : ${
								mods.indexOf("DT") !== -1 || mods.indexOf("NC") !== -1
									? returnDuration(beatmap.totalLength / 1.5)
									: returnDuration(beatmap.totalLength)
							}`,
							true
						)
						.setImage(
							`https://assets.ppy.sh/beatmaps/${
								beatmap.setId
							}/covers/cover.jpg`
						);
					if (mode === "osu") {
						embed.addField(
							"Estimated PPs",
							`**FC 100%** : ${r(results!.pp)}pp\n**${
								combo === beatmap.maxCombo ? "FC " : ""
							}${accuracy}%** : ${r(resultsAcc!.pp)}pp`,
							true
						);
					}
					embed.addField(
						"Specifications",
						`${hitobjects} **Hitobjects** (${
							beatmap.countNormal
						} **Circles** / ${beatmap.countSlider} **Sliders** / ${
							beatmap.countSpinner
						} **Spinners**)${["osu", "ctb"].includes(mode) ? `\n**Max Combo** x${beatmap.maxCombo}` : ""}${["osu", "ctb"].includes(mode) ? ` | **Aim Difficulty** ${t(
							Number(beatmap.diffAim)
						)}` : ""}${mode === "osu"
							? ` | **Aim Difficulty** ${t(Number(beatmap.diffSpeed))}`
							: ""
						}\n${
							mods.indexOf("DT") !== -1 || mods.indexOf("NC") !== -1
								? Math.round(beatmap.bpm * 1.5)
								: beatmap.bpm
						} **BPM** ${
							mode === "osu" ? `| **CS** ${r(results!.cs)} ` : ""
						}${mode === "ctb" ? `| **CS** ${r(beatmap.diffSize)} ` : ""}${
							mode === "mania" ? `| **KA** ${beatmap.diffSize} ` : ""
						}${mode === "osu" ? `| **AR** ${r(results!.ar)} ` : ""}${
							mode === "ctb" ? `| **AR** ${r(beatmap.diffApproach)} ` : ""}| **HP** ${
							r(results === null ? beatmap.diffDrain : results.hp)
						} | **${mode === "osu" ? "OD" : "AC"}** ${r(results === null ? beatmap.diffOverall : results.od)}`
					);
					if (beatmap.source !== null) { embed.setFooter(`Source: ${beatmap.source}`); }
					ctx.reply(embed);
				});
			} else {
				ctx.reply("the map you asked does not exist, or at least in the mode specified.");
			}
		} else {
			ctx.reply("the mode you specified does not exist. Check `&?osu` for more information.");
		}
		return true;
	}
};
