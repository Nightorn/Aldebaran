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
	combo?: number,
	acc?: number,
	nmiss?: number,
	n300?: number,
	n100 = 0,
	n50 = 0
) => new Promise((resolve: (value: Result) => void) => {
	retrieveBeatmapFile(beatmapId).then(() => {
		const file = fs.readFileSync(`./cache/osu!/${beatmapId}.osu`, { encoding: "utf8" });
		const { map } = new ojsama.parser().feed(file.toString());
		if (map.mode === 0) {
			const stars = new ojsama.diff().calc({ map, mods });
			const pp = ojsama.ppv2({
				stars,
				combo,
				nmiss,
				acc_percent: acc,
				n100,
				n50
			});
			const { ar, cs, od, hp } = new ojsama.std_beatmap_stats({ ...stars.map })
				.with_mods(mods);
			resolve({
				pp: pp.total,
				accuracy: n300 ? Math.round(new ojsama.std_accuracy({
					nmiss, n300, n100, n50
				}).value() * 10000) / 100 : 0,
				ar: Math.round(100 * (ar ? ar : 0)) / 100,
				cs: Math.round(100 * (cs ? cs : 0)) / 100,
				od: Math.round(od ? od : 0),
				hp: Math.round(100 * (hp ? hp : 0)) / 100
			});
		}
	});
});
