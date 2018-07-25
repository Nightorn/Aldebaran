exports.run = (bot, message, args, apiratelimit) => {
    const Discord = require("discord.js");
    const apikey = require("./../../config.json");
    const request = require('request');
    const locationdb = require("./../../Data/drpglocationlist.json");
    var usrid = message.author.id;
    if(args.length > 0){
        usrid = message.mentions.members.size > 0 ? message.mentions.members.first().id : args[0];
    };
        if (apiratelimit == 0)return message.channel.send(`This Command is globally ratelimited, please try again in 1min.`);
        bot.fetchUser(usrid).then((user) => {
            request({uri:`http://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body) {
                if (err) return;
                const data = JSON.parse(body);
                if (data.error != undefined)return message.channel.send(`**Error**: No User Profile Found.`)
                apiratelimit = response.headers["x-ratelimit-remaining"]
                var ratelimitrest = Math.floor(parseInt(response.headers["x-ratelimit-reset"] - (Date.now()/1000)))
                var maxpoints = Math.floor(data.level * 5)
                var skillinfo = data.skills
                var currentpoints = data.attributes
                var lumbercurrent = Math.floor(((currentpoints.lumberboost / 25 ) + 1) + skillinfo.chop.level)
                var lumbermax = Math.floor(((maxpoints / 25) + 1) + skillinfo.chop.level)
                const embed = new Discord.RichEmbed()
                .setTitle(data.name + "'s Skill Info")
                .setAuthor(message.author.username,message.author.avatarURL)
                .setColor(0x00AE86)
                .setFooter(`${apiratelimit} Global Uses Remain Before Ratelimited | Usages Reset In ${ratelimitrest} seconds.`)
                .addField(`**__Chopping__**`,`**Level:** *${skillinfo.chop.level}*\n**Total XP:** *${skillinfo.chop.xp}*\n**Current Chop Reward:** *${lumbercurrent}* Logs.\n**Max Chop Rewards:** *${lumbermax}* Logs.`)
                message.channel.send(embed)
            });
        })
        .catch(err => {
            message.reply("Error you must enter a valid UserID or User Mention")
        })
}
exports.infos = {
    category: "DRPG",
    description: "Displays users skills info.",
    usage: "\`&skills\` or \`&skills <usermention>\` or \`&skills <userid>\`",
    example: "\`&skills\` or \`&skills @aldebaran\` or \`&skills 246302641930502145\`",
    cooldown: {
        time: 5000,
        rpm: 25,
        resetTime: 60000,
        commandGroup: "drpg"
    }
}