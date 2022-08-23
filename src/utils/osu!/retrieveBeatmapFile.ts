import fs from "fs";
import fetch from "node-fetch";

export default (beatmapId: number) => new Promise((resolve, reject) => {
	if (!fs.existsSync("./cache/osu!/")) fs.mkdirSync("./cache/osu!/");
	if (fs.existsSync(`./cache/osu!/${beatmapId}.osu`)) resolve(true);
	else {
		fetch(`http://osu.ppy.sh/osu/${beatmapId}`).then(res => {
			if (res.body) {
				const dest = fs.createWriteStream(`./cache/osu!/${beatmapId}.osu`);
				res.body.pipe(dest);
				res.body.on("error", reject);
				dest.on("finish", resolve);
				dest.on("error", reject);
			}
		});
	}
});
