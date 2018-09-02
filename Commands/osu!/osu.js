exports.run = (bot, message, args) => {
    const config = require('./../../config.json');
    const { MessageEmbed } = require('discord.js');
    const Nodesu = require('nodesu');
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
            client.user.get(args[0], Nodesu.Mode[mode]).then(data => {
                const f = x => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") };
                const i = x => { return parseInt(x) };
                const t = x => { let s = x.toString(); let l = s.length; return l > 9 ? `${f(s.substr(0, l - 6))}**M**` : l > 6 ? `${f(s.substr(0, l - 3))}**K**`: f(x) }
                user = new Nodesu.User(data);
                const embed = new MessageEmbed()
                    .setAuthor(`${user.username}  |  #${f(user.rank)} (${f(user.pp)}pp)  |  osu!${mode === 'osu' ? '' : mode}`, `https://a.ppy.sh/${user.id}`, `https://osu.ppy.sh/users/${user.id}`)
                    .setTitle(`Level ${Math.floor(user.level)} (${((user.level % 1) * 100).toFixed(2)}%)  |  :flag_${user.country.toLowerCase()}:  #${f(user.countryRank)}`)
                    .addField(`Hit Accuracy`, `${user.accuracy.toFixed(2)}%`, true)
                    .addField(`Play Count`, f(user.playcount), true)
                    .addField(`Good Plays`, `SS/S/A - ${f(i(user.countRankSS) + i(data.count_rank_ssh) + i(user.countRankS) + i(data.count_rank_sh) + i(user.countRankA))}`, true)
                    .addField(`Statistics`, `**Total Hits** : ${f(i(user.count300) + i(user.count100) + i(user.count50))}\n**Ranked Score** : ${t(user.rankedScore)}\n**Total Score** : ${t(user.totalScore)}`, true)
                    .addField(`Scores`, `**300 Count** : ${t(user.count300)}\n**100 Count** : ${f(user.count100)}\n**50 Count** : ${f(user.count50)}`, true)
                    .addField(`Ranks Achieved`, `**SS+ / SS** : **${f(i(user.countRankSS) + i(data.count_rank_ssh))}** (${f(data.count_rank_ssh)} / ${f(user.countRankSS)})\n**S+ / S** : **${f(i(user.countRankS) + i(data.count_rank_sh))}** (${f(data.count_rank_sh)} / ${f(user.countRankS)})\n**A** : ${f(user.countRankA)}`, true)
                    .setColor(`#cc5288`);
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
    description: "Shows the stats of the user specified",
    usage: "\`&osu <Username|User ID> <Mode>\`",
    example: "\`&osu Ciborn\`",
    cooldown: {
        time: 1000,
        rpm: 600,
        resetTime: 60000,
        commandGroup: "osu!"
    }
}