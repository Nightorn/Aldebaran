const fs = require("fs");
const fetch = require("node-fetch");

module.exports = beatmapId => new Promise((resolve, reject) => {
	if (!fs.existsSync("./cache/osu!/")) fs.mkdirSync("./cache/osu!/");
	if (fs.existsSync(`./cache/osu!/${beatmapId}.osu`)) resolve();
	else {
		fetch(`http://osu.ppy.sh/osu/${beatmapId}`).then(res => {
			const dest = fs.createWriteStream(`./cache/osu!/${beatmapId}.osu`);
			res.body.pipe(dest);
			res.body.on("error", reject);
			dest.on("finish", resolve);
			dest.on("error", reject);
		});
	}
});
