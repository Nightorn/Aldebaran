const ojsama = require('ojsama');
const oppai = require('oppai');
module.exports = (beatmapId, mods, combo, acc, nmiss) => {
    return new Promise((resolve) => {
        require('./retrieveBeatmapFile')(beatmapId).then(() => {
            const file = require('fs').readFileSync(`./cache/osu!/${beatmapId}.osu`, { encoding: "utf8" });
            var ctx = oppai.Ctx(), b = oppai.Beatmap(ctx);
            b.parse(`./cache/osu!/${beatmapId}.osu`, oppai.Buffer(2000000), 2000000, true);
            b.applyMods(mods);
            const dctx = oppai.DiffCalcCtx(ctx), diff = dctx.diffCalc(b);
            var parser = new ojsama.parser().feed(file.toString());
            var map = parser.map;
            if (map.mode === 0) {
                var stars = new ojsama.diff().calc({
                    map: map,
                    mods: mods
                });
                var pp = ojsama.ppv2({
                    stars: stars,
                    combo: combo,
                    nmiss: nmiss,
                    acc_percent: acc
                });
                resolve({
                    aim: stars.aim,
                    ar: b.ar(),
                    circles: stars.map.ncircles,
                    cs: b.cs(),
                    hitobjects: stars.map.ncircles + stars.map.nsliders + stars.map.nspinners,
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
    });
}