exports.run = async (bot, message, args) => {
    const { MessageEmbed } = require('discord.js'), Nodesu = require('nodesu'), ojsama = require('ojsama');
    const client = new Nodesu.Client(require('./../../config.json').apikeys["osu!"]);
    if (args.length === 0) return message.channel.send(`You need to send a link of the beatmap or its ID. Check \`&osu ?\` for more informations.`);
    if (args[0].toLowerCase() === '?') {
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle(`Documentation for the osu! (Beatmap) command`)
            .setDescription(`First, you have to send the link of the beatmap you want to see the informations, or you also use its ID. After that, you can choose the mode to show the informations from, note that the default mode is standard. See more informations below. You can also specify with which mods you want to play, by adding \`+\` before, like that : \`+HDDT\`, specify the combo you want like \`x666\` or your accuracy with \`69%\`. The most completed command would be \`&osumap https://osu.ppy.sh/beatmapsets/627629#osu/1322507 +HDDT x2000 90%\`. This command does not work with beatmapsets or by the name of beatmaps.`)
            .addField(`Supported Modes`, `**osu!standard** : BY DEFAULT, --osu\n**osu!taiko** : --taiko\n**osu!ctb** : --ctb\n**osu!mania** : --mania`, true)
            .addField(`Supported Mods`, `NF, EZ, HT, SO, HR, DT, NC, HD, FL`, true)
            .setColor(`BLUE`);
        message.channel.send({embed});
    } else {
        var mode = 'osu', mods = [], modsBitfield = 0, supportedMods = ['NF', 'EZ', 'HT', 'SO', 'HR', 'DT', 'NC', 'HD', 'FL'], combo = null, accuracy = 98, nmiss = null, _mods = "";
        for (let element of args) {
            if (element.indexOf('--') === 0) mode = element.replace('--', '');   
            else if (element.indexOf('+') === 0) {
                _mods = element.replace('+', '');
                mods = element.replace('+', '').split(/([A-Z]{2})/g);
                mods = mods.filter(v => v !== '' && supportedMods.indexOf(v) !== -1);
            } else if (element.indexOf('x') === 0) {
                if (!isNaN(parseInt(element.replace('x', '')))) combo = parseInt(element.replace('x', ''));
            } else if (element.indexOf('%') === element.length - 1) {
                if (!isNaN(parseFloat(element.replace('%', '')))) accuracy = parseFloat(element.replace('%', ''));
            } else if (element.indexOf('#') !== -1) {
                if (element.indexOf('#taiko/') !== -1) mode = 'taiko';
                else if (element.indexOf('#fruits/') !== -1) mode = 'ctb';
                else if (element.indexOf('#mania/') !== -1) mode = 'mania';
            } else if (element.indexOf('m') === element.length -1) {
                if (!isNaN(parseInt(element.replace('m', '')))) nmiss = parseInt(element.replace('m', ''));
            }
        };
        if (Nodesu.Mode[mode] !== undefined) {
            const data = await client.beatmaps.getByBeatmapId(args[0].replace('>', '').replace('<', '').split('/').pop(), Nodesu.Mode[mode], undefined, 'string');
            if (data.length > 0) {
                const beatmap = new Nodesu.Beatmap(data[0]);
                require(`${process.cwd()}/functions/osu!/retrieveBeatmapFile.js`)(beatmap.id).then(async () => {
                    var approvalStatus = null;
                    for (let [key, value] of Object.entries(Nodesu.ApprovalStatus)) if (value === beatmap.approved) approvalStatus = key[0].toUpperCase() + key.slice(1);
                    const d = x => { return x.toString().length === 1 ? `0${x}` : x };
                    const t = (x,l) => { return x.toFixed(l === undefined ? 2 : l); };
                    const r = x => { return Math.round(x * 100) / 100 }
                    const returnDate = x => { return `${d(x.getUTCMonth()+1)}/${d(x.getUTCDay()+1)}/${x.getUTCFullYear()} ${d(x.getUTCHours())}:${d(x.getUTCMinutes())} UTC` };
                    const returnDuration = x => { return x > 60 ? `${Math.floor(x/60)}m${d(Math.floor(x%60))}s` : `${Math.floor(x)}s` }
                    combo = combo === null ? beatmap.maxCombo : combo;
                    const results = await require('./../../functions/osu!/ppv2Results')(beatmap.id, ojsama.modbits.from_string(_mods), beatmap.maxCombo, 100, 0);
                    const resultsAcc = await require('./../../functions/osu!/ppv2Results')(beatmap.id, ojsama.modbits.from_string(_mods), combo, accuracy, nmiss === null ? undefined : nmiss);
                    if (mods.length !== 0) for (let mod of mods) modsBitfield += require('./../../functions/osu!/computeMods').mods[mod.toLowerCase()]
                        else mods = ['NoMod'];
                    
                    const embed = new MessageEmbed()
                        .setAuthor(beatmap.creator, `https://a.ppy.sh/${data[0].creator_id}`, `https://osu.ppy.sh/users/${data[0].creator_id}`)
                        .setTitle(`__**${beatmap.title}** by ${beatmap.artist}__ [${mode === 'mania' ? `[${results.cs}K] ` : ""}${beatmap.version}] (+${mods.join('')}${mode === 'osu' ? ` **\`${r(results.stars)}\` ★**` : ""})`)
                        .setDescription(`${data[0].approved_date === null ? `**${approvalStatus}**  •  Last Updated on ${returnDate(new Date(data[0].last_update))}` : `**${approvalStatus}** on ${returnDate(new Date(data[0].approved_date))}`}\n${mode !== 'osu' ? "*Many informations are unavailable as this is not a standard map.*" : ""}`)
                        .setURL(`https://osu.ppy.sh/beatmapsets/${beatmap.setId}/#${mode}/${beatmap.id}`)
                        .addField(`Map Length`, `**Drain Time** : ${mods.indexOf('DT') !== -1 || mods.indexOf('NC') !== -1 ? returnDuration(beatmap.hitLength / 1.5) : returnDuration(beatmap.hitLength)}\n**Song Duration** : ${mods.indexOf('DT') !== -1 || mods.indexOf('NC') !== -1 ? returnDuration(beatmap.totalLength / 1.5) : returnDuration(beatmap.totalLength)}`, true)
                        .setImage(`https://assets.ppy.sh/beatmaps/${beatmap.setId}/covers/cover.jpg`)
                        .setColor(`#cc5288`);
                    if (mode === 'osu') embed.addField(`Estimated PPs`, `**FC 100%** : ${r(results.pp)}pp\n**${combo === beatmap.maxCombo ? `FC ` : ''}${accuracy}%** : ${r(resultsAcc.pp)}pp`, true);
                    embed.addField(`Specifications`, `${mode === 'osu' ? `${results.hitobjects} **Hitobjects** (${results.circles} **Circles** / ${results.sliders} **Sliders** / ${results.spinners} **Spinners**)\n**Max Combo** x${data[0].max_combo} | **Speed** ${t(results.aim)} | **Aim Difficulty** ${t(results.speed)}` : ''}\n${mods.indexOf('DT') !== -1 || mods.indexOf('NC') !== -1 ? Math.round(beatmap.bpm * 1.5) : beatmap.bpm} **BPM** ${mode === 'osu' ? `| **CS** ${r(results.cs)} ` : ""}| **AR** ${r(results.ar)} | **HP** ${r(results.hp)} | **OD** ${r(results.od)}`, true);
                    if (beatmap.source !== null) embed.setFooter(`Source:320933389513523220 ${beatmap.source}`)
                    message.channel.send({embed});
                });
            } else message.reply("the map you asked does not exist, or at least in the mode specified.");
        } else message.reply("the mode you specified does not exist. Check \`&osu ?\` for more informations.");
    }
}

exports.infos = {
    category: "osu!",
    description: "Shows the informations of the map specified",
    usage: "\`&osu <Beatmap Link|Beatmap ID> <Mode> <Mods> <Accuracy> <Combo>\`",
    example: "\`&osumap 1588069\`",
    cooldown: {
        time: 1000,
        rpm: 600,
        resetTime: 60000,
        commandGroup: "osu!"
    }
}