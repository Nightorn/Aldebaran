exports.run = (bot, message, args,) => {
    const { MessageEmbed } = require("discord.js");
    const request = require('request');
    require(`${process.cwd()}/functions/action/userCheck.js`)(bot, message, args).then(usrid => {
        request({uri:`http://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization":bot.config.drpg_apikey} }, function(err, response, body) {
            if (err) return;
            const data = JSON.parse(body).data;
            if (data.error != undefined)return message.channel.send(`**Error**: No User Profile Found.`)
            var maxpoints = Math.floor(data.level * 5)
            var skillinfo = data.skills
            var currentpoints = data.attributes
            var tool = data.tool
            var axebonus = 0;
            if (tool.axe === "370") axebonus = 0
            else if (tool.axe === "413") axebonus += 1
            else if (tool.axe === "415" ) axebonus += 3
            else if (tool.axe === "416") axebonus += 5
            else if (tool.axe === "417") axebonus += 8
            else axebonus = 0     
            var lumbercurrent = Math.floor((((currentpoints.lumberBoost / 25 ) + 1) + skillinfo.chop.level) + axebonus)
            var lumbermax = Math.floor((((maxpoints / 25) + 1) + skillinfo.chop.level) + axebonus)
                
            const embed = new MessageEmbed()
                .setTitle(data.name + "'s Skill Info")
                .setAuthor(message.author.username,message.author.avatarURL())
                .setColor(0x00AE86)
                .addField(`**__Chopping__**`,`**Level:** *${skillinfo.chop.level}*\n**Total XP:** *${skillinfo.chop.xp}*\n**Current Chop Reward:** *${lumbercurrent}* Logs.\n**Max Chop Rewards:** *${lumbermax}* Logs.`)
            message.channel.send(embed)
        });
    }).catch(() => {
        message.reply("Error you must enter a valid UserID or User Mention");
    });
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