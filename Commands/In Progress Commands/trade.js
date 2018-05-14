exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    const apikey = require("./../config.json");
    const request = require('request');
    const info = require("./../data/tradelist.json");
    if (args.length < 2) return;
    request({uri:`http://api.discorddungeons.me/v3/trade/buy/${args[0]}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body){
        if (err)return
        const data = JSON.parse(body)
        var tradeid = [];
        var pricesetpoint 
        pricesetpoint = (args.length > 0) ? args[1] : 1
        for (var i = 0; i < data.trades.length; i++){
            if ((data.trades[i].buy.item[`${args[0]}`] > data.trades[i].bought) && data.trades[i].buy.price > pricesetpoint){
                tradeid.push(data.trades[i].id, data.trades[i].buy.price)
            }           
        }
        const embed = new Discord.RichEmbed()
        .setTitle("Market Info")
        .setAuthor(message.author.username,message.author.avatarURL)
        .setColor(0x00AE86)
        .setDescription(`Work In Progress`)
        .addField(`Coal Trades above ${pricesetpoint}`,`${tradeid.join(`  `)}`,false)
        message.channel.send(embed)
    })
    
}       
