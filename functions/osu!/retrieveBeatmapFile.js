module.exports = (beatmapId) => {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        if (!fs.existsSync(`./osu/`)) fs.mkdirSync(`./osu/`);
        if (fs.existsSync(`./osu/${beatmapId}.osu`)) return resolve();
        const fetch = require('node-fetch');
        fetch(`https://bloodcat.com/osu/b/${beatmapId}`).then(res => {
            const dest = fs.createWriteStream(`./osu/${beatmapId}.osu`);
            res.body.pipe(dest);
            res.body.on('error', reject);
            dest.on('finish', resolve);
            dest.on('error', reject);
        });
    });
}