const ojsama = require("ojsama");
const oppai = require("oppai");
const fs = require("fs");
const retrieveBeatmapFile = require("./retrieveBeatmapFile");

module.exports = (beatmapId, mods, combo, acc, nmiss) => new Promise(
	resolve => {
		retrieveBeatmapFile(beatmapId).then(() => {
			const file = fs.readFileSync(`./cache/osu!/${beatmapId}.osu`, { encoding: "utf8" });
			const ctx = oppai.Ctx(); const
				b = oppai.Beatmap(ctx);
			b.parse(`./cache/osu!/${beatmapId}.osu`, oppai.Buffer(2000000), 2000000, true);
			b.applyMods(mods);
			// const dctx = oppai.DiffCalcCtx(ctx);
			// const diff = dctx.diffCalc(b);
			// eslint-disable-next-line new-cap
			const parser = new ojsama.parser().feed(file.toString());
			const { map } = parser;
			if (map.mode === 0) {
				// eslint-disable-next-line new-cap
				const stars = new ojsama.diff().calc({
					map,
					mods
				});
				const pp = ojsama.ppv2({
					stars,
					combo,
					nmiss,
					acc_percent: acc
				});
				resolve({
					aim: stars.aim,
					ar: b.ar(),
					circles: stars.map.ncircles,
					cs: b.cs(),
					hitobjects:
						stars.map.ncircles + stars.map.nsliders + stars.map.nspinners,
					hp: b.hp(),
					od: b.od(),
					pp: pp.total,
					sliders: stars.map.nsliders,
					speed: stars.speed,
					spinners: stars.map.nspinners,
					stars: stars.total
				});
			} else {
				resolve({
					ar: b.ar(),
					cs: b.cs(),
					hp: b.hp(),
					od: b.od()
				});
			}
		});
	}
);
