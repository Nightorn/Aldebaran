import ojsama, { modbits } from "ojsama";
import fs from "fs";
import retrieveBeatmapFile from "./retrieveBeatmapFile.js";

export type Result = {
	pp: number,
	accuracy: number,
	ar: number,
	cs: number,
	od: number,
	hp: number
};

export default (
	beatmapId: number,
	mods: modbits,
	combo: number,
	acc?: number,
	nmiss?: number,
	n300?: number,
	n100: number = 0,
	n50: number = 0
) => new Promise((resolve: (value: Result) => void) => {
	retrieveBeatmapFile(beatmapId).then(() => {
		const file = fs.readFileSync(`./cache/osu!/${beatmapId}.osu`, { encoding: "utf8" });
		// eslint-disable-next-line new-cap
		const parser = new ojsama.parser().feed(file.toString());
		const { map } = parser;
		if (map.mode === 0) {
			// eslint-disable-next-line new-cap
			const stars = new ojsama.diff().calc({ map, mods });
			const pp = ojsama.ppv2({
				stars,
				combo,
				nmiss,
				acc_percent: acc,
				n100,
				n50
			});
				// eslint-disable-next-line new-cap
			const statsWithMods = new ojsama.std_beatmap_stats(
				{ ...stars.map }
			).with_mods(mods);
			resolve({
				pp: pp.total,
				// eslint-disable-next-line new-cap
				accuracy: n300 ? Math.round(new ojsama.std_accuracy({
					nmiss, n300, n100, n50
				}).value() * 10000) / 100 : 0,
				ar: Math.round(100 * statsWithMods.ar!) / 100,
				cs: Math.round(100 * statsWithMods.cs!) / 100,
				od: Math.round(100 * statsWithMods.od! / 100),
				hp: Math.round(100 * statsWithMods.hp!) / 100
			});
		}
	});
});
