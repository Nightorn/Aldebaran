exports.run = (bot, message, args) => {
    const Discord = require("discord.js");
    const apikey = require(`${process.cwd()}/config.json`);
    const request = require('request');
    
    var guildid = args[0]
    request({uri:`http://api.discorddungeons.me/v3/guild/${guildid}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body) {
        const data = JSON.parse(body)
        var guildname = data.name
        var ownerid = data.owner
        var guildimage = data.image.url
        var guildgold = data.gold
        var guildopen = (data.open == true) ? `Open to join` : `Invite Only`;
        var guildmembercount = data.members.length
        const embed = new Discord.MessageEmbed()
            .setTitle(`${guildname} Guild - ${guildmembercount} Members.`)
            .setAuthor(message.author.username,message.author.avatarURL())
            .setColor(0x00AE86)
            .addField(`**__Owner__**`,`${ownerid}`,true)
            .addField(`__**Requirements**__`,`${guildopen}`,true)
            .addField(`__**Guild Bank**__`,`${guildgold}`)
            .setImage(`${guildimage}`)
        message.channel.send({embed})

    })




}