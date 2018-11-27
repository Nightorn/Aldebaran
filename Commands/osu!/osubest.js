exports.run = (bot, message, args) => {
    const config = require('./../../config.json');
    const { MessageEmbed } = require('discord.js'), Nodesu = require('nodesu'), oppai = require('oppai');
    const client = new Nodesu.Client(config.apikeys["osu!"]);
    if (args.length === 0) return message.channel.send(`You need to specify the name of the user you want to the stats. Check \`&osu ?\` for more informations.`);
    if (args[0].toLowerCase() === '?') {
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle(`Documentation for the osu! (User Profile) command`)
            .setDescription(`First, you have to run the command with the osu! username of the user you want to see the stats, or eventually his user ID. After that, you can choose the mode to show stats from, note that the default mode is standard.`)
            .addField(`Supported Modes`, `**osu!standard** : BY DEFAULT, --osu\n**osu!taiko** : --taiko\n**osu!ctb** : --ctb\n**osu!mania** : --mania`)
            .setColor(`BLUE`);
        message.channel.send({embed});
    } else {
        var mode = 'osu';
        for (let element of args) if (element.indexOf('--') === 0) mode = element.replace('--', '');
        if (Nodesu.Mode[mode] !== undefined) {
            client.user.getBest(args[0], Nodesu.Mode[mode], 5).then(async data => {
                const f = x => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") };
                var ctx = oppai.Ctx(), maps = [], list = "";
                for (let score of data) {
                    await require(`${process.cwd()}/functions/osu!/retrieveBeatmapFile.js`)(score.beatmap_id);
                    var b = oppai.Beatmap(ctx), buf = oppai.Buffer(2000000), dctx = oppai.DiffCalcCtx(ctx);
                    b.parse(`./cache/osu!/${score.beatmap_id}.osu`, buf, 2000000, true);
                    var diff = dctx.diffCalc(b);
                    var res = ctx.ppCalc(diff.aim, diff.speed, b, oppai.nomod, parseInt(score.maxcombo), parseInt(score.countmiss), parseInt(score.count300), parseInt(score.count100), parseInt(score.count50));
                    score.accuracy = res.accPercent;
                    maps.push(score);
                }
                for (let map of maps) {
                    const metadata = (await client.beatmaps.getByBeatmapId(map.beatmap_id, Nodesu.Mode[mode], 1, true))[0];
                    list += `**\`[${map.rank}]\` ${f(map.pp)}pp** | __${metadata.artist} - ${metadata.title}__ [${metadata.version}] (${parseInt(metadata.difficultyrating).toFixed(2)}\`*\`)\n**Score** \`${f(map.score)}\` | **Accuracy** ${Math.round(map.accuracy * 100) / 100}% | **300** ${f(map.count300)} | **100** ${map.count100} | **50** ${map.count50} | **Misses** ${map.countmiss}\n\n`
                }
                const user = (await client.users.get(maps[0].user_id, Nodesu.Mode[mode]))[0];
                const embed = new MessageEmbed()
                    .setAuthor(`${user.username}'s 10 best plays`, `https://a.ppy.sh/${user.user_id}`)
                    .setDescription(list)
                    .setColor('BLUE');
                message.channel.send({embed});
            }).catch((err) => {
                message.reply("the user you specified does not exist, or at least in the mode specified.");
            });
        } else {
            message.reply("the mode you specified does not exist. Check \`&osu ?\` for more informations.");
        }
    }
}

exports.infos = {
    category: "osu!",
    description: "Shows the best plays of the user specified",
    usage: "\`&osubest <Username|User ID>\`",
    example: "\`&osubest Ciborn\`",
    cooldown: {
        time: 1000,
        rpm: 600,
        resetTime: 60000,
        commandGroup: "osu!"
    }
}