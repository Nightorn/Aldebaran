module.exports = (beatmapId) => {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        if (!fs.existsSync(`./cache/osu!/`)) fs.mkdirSync(`./cache/osu!/`);
        if (fs.existsSync(`./cache/osu!/${beatmapId}.osu`)) return resolve();
        const fetch = require('node-fetch');
        fetch(`https://bloodcat.com/osu/b/${beatmapId}`).then(res => {
            const dest = fs.createWriteStream(`./cache/osu!/${beatmapId}.osu`);
            res.body.pipe(dest);
            res.body.on('error', reject);
            dest.on('finish', resolve);
            dest.on('error', reject);
        });
    });
}