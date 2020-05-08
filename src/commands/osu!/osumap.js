const Nodesu = require("nodesu");
const ojsama = require("ojsama");
const retrieveBeatmapFile = require("../../utils/osu!/retrieveBeatmapFile");
const ppv2Results = require("../../utils/osu!/ppv2Results");
const { Command, Embed } = require("../../groups/OsuCommand");

module.exports = class OsumapCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Shows the informations of the specified map",
			help: "First, you have to send the link of the beatmap you want to see the informations of, or you also use its ID. After that, you can choose the mode to show the informations from, note that the default mode is standard. See more informations below. You can also specify with which mods you want to play, by adding `+` before, like that : `+HDDT`, specify the combo you want like `x666` or your accuracy with `69%`. The most completed command would be `&osumap https://osu.ppy.sh/beatmapsets/627629#osu/1322507 +HDDT x2000 90%`. This command does not work with beatmapsets or by the name of beatmaps.",
			example: "1097541 --taiko +HD 97% 100x 69m",
			args: {
				map: { as: "expression", regex: /\d+$/, desc: "Beatmap URL / ID" },
				mode: { as: "mode?", desc: "Game Mode (--osu, --mania, --ctb, --taiko)" },
				mods: { as: "expression?", regex: /(\+(\D{2})+)/, desc: "Mods (ex: +HDDT)" },
				accuracy: { as: "expression?", regex: /(\d{1,2}\.\d{1,2}%)/, desc: "Accuracy (ex: 98.95%)" },
				combo: { as: "expression?", regex: /\d+(?=x)/, desc: "Combo (ex: 469x)" },
				nmiss: { as: "expression?", regex: /\d+(?=m)/, desc: "Miss Amount (ex: 7m)" }
			}
		});
	}

	async run(bot, message, args) {
		const client = new Nodesu.Client(process.env.API_OSU);
		if (args.map === undefined) {
			return message.channel.send(
				"You need to send a link of the beatmap or its ID. Check `&?osu` for more informations."
			);
		}
		const supportedMods = ["NF", "EZ", "HT", "SO", "HR", "DT", "NC", "HD", "FL"];
		const { accuracy, nmiss } = args;
		let { combo } = args;
		const mode = args.mode || "osu";
		const mods = args.mods.replace("+", "").split(/([A-Z]{2})/)
			.filter(v => v !== "" && supportedMods.includes(v));
		const stringMods = mods.join("");
		if (Nodesu.Mode[mode] !== undefined) {
			const data = await client.beatmaps.getByBeatmapId(
				args.map, Nodesu.Mode[mode],
				1, true, ojsama.modbits.from_string(stringMods)
			);
			if (data.length > 0) {
				const beatmap = new Nodesu.Beatmap(data[0]);
				beatmap.countNormal = data[0].count_normal;
				beatmap.countSlider = data[0].count_slider;
				beatmap.countSpinner = data[0].count_spinner;
				const hitobjects = Number(beatmap.countNormal)
					+ Number(beatmap.countSlider) + Number(beatmap.countSpinner);
				retrieveBeatmapFile(beatmap.id).then(async () => {
					let approvalStatus = null;
					for (const [key, value] of Object.entries(Nodesu.ApprovalStatus)) {
						if (value === beatmap.approved)
							approvalStatus = key[0].toUpperCase() + key.slice(1);
					}
					const d = x => (x.toString().length === 1 ? `0${x}` : x);
					const t = (x, l) => x.toFixed(l === undefined ? 2 : l);
					const r = x => Math.round(x * 100) / 100;
					const returnDate = x => `${d(x.getUTCMonth() + 1)}/${d(
						x.getUTCDay() + 1
					)}/${x.getUTCFullYear()} ${d(x.getUTCHours())}:${d(
						x.getUTCMinutes()
					)} UTC`;
					const returnDuration = x => (x > 60
						? `${Math.floor(x / 60)}m${d(Math.floor(x % 60))}s`
						: `${Math.floor(x)}s`);
					combo = combo === null ? beatmap.maxCombo : combo;
					let results = null;
					let resultsAcc = null;
					if (mode === "osu") {
						results = await ppv2Results(
							beatmap.id,
							ojsama.modbits.from_string(stringMods),
							beatmap.maxCombo,
							100,
							0,
							hitobjects
						);
						resultsAcc = await ppv2Results(
							beatmap.id,
							ojsama.modbits.from_string(stringMods),
							combo,
							accuracy,
							nmiss === null ? undefined : nmiss,
							hitobjects
						);
					}

					const embed = new Embed(this)
						.setAuthor(
							beatmap.creator,
							`https://a.ppy.sh/${data[0].creator_id}`,
							`https://osu.ppy.sh/users/${data[0].creator_id}`
						)
						.setTitle(
							`__${beatmap.artist} - **${beatmap.title}**__ [${beatmap.version}] (**\`${r(beatmap.difficultyRating)}\`★${mods.length === 0 ? "" : ` +${mods.join("")}`}**)`
						)
						.setDescription(
							`${
								data[0].approved_date === null
									? `**${approvalStatus}**  •  Last Updated on ${returnDate(
										new Date(data[0].last_update)
									)}`
									: `**${approvalStatus}** on ${returnDate(
										new Date(data[0].approved_date)
									)}`
							}\n${
								mode !== "osu"
									? "*Many informations are unavailable as this is not a standard map.*"
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
							`**FC 100%** : ${r(results.pp)}pp\n**${
								combo === beatmap.maxCombo ? "FC " : ""
							}${accuracy}%** : ${r(resultsAcc.pp)}pp`,
							true
						);
					}
					embed.addField(
						"Specifications",
						`${hitobjects} **Hitobjects** (${
							beatmap.countNormal
						} **Circles** / ${beatmap.countSlider} **Sliders** / ${
							beatmap.countSpinner
						} **Spinners**)${["osu", "ctb"].includes(mode) ? `\n**Max Combo** x${data[0].max_combo}` : ""}${["osu", "ctb"].includes(mode) ? ` | **Aim Difficulty** ${t(
							Number(beatmap.diffAim)
						)}` : ""}${mode === "osu"
							? ` | **Aim Difficulty** ${t(Number(beatmap.diffSpeed))}`
							: ""
						}\n${
							mods.indexOf("DT") !== -1 || mods.indexOf("NC") !== -1
								? Math.round(beatmap.bpm * 1.5)
								: beatmap.bpm
						} **BPM** ${
							mode === "osu" ? `| **CS** ${r(results.cs)} ` : ""
						}${mode === "ctb" ? `| **CS** ${r(beatmap.diffSize)} ` : ""}${
							mode === "mania" ? `| **KA** ${beatmap.diffSize} ` : ""
						}${mode === "osu" ? `| **AR** ${r(results.ar)} ` : ""}${
							mode === "ctb" ? `| **AR** ${r(beatmap.diffApproach)} ` : ""}| **HP** ${
							r(results === null ? beatmap.diffDrain : results.hp)
						} | **${mode === "osu" ? "OD" : "AC"}** ${r(results === null ? beatmap.diffOverall : results.od)}`
					);
					if (beatmap.source !== null) { embed.setFooter(`Source: ${beatmap.source}`); }
					message.channel.send({ embed });
				});
			} else {
				message.reply(
					"the map you asked does not exist, or at least in the mode specified."
				);
			}
		} else {
			message.reply(
				"the mode you specified does not exist. Check `&?osu` for more informations."
			);
		}
		return true;
	}
};
