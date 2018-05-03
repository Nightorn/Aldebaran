exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    const apikey = require("./../config.json");
    const request = require('request');
    const itemlist = require("./../Data/drpgitemlist.json"); 
    var usrid = message.author.id;
        if(args.length > 0){
            usrid = message.mentions.members.size > 0 ? message.mentions.members.first().id : args[0];
        };
    client.fetchUser(usrid).then((user) => {
                 
            request({uri:`http://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body) {
            if (err) return;
            const data = JSON.parse(body);
            var trapdate = new Date(data.trap.time);
            var trapelapsed = Math.round((new Date()-data.trap.time)/3600000);
            const embed = new Discord.RichEmbed()
                .setTitle(data.name + "'s Planting Info")
                .setAuthor(message.author.username,message.author.avatarURL)
                .setColor(0x00AE86)
                .setDescription(`Don't forget to water them!!`)
                    for (let [key, value] of Object.entries(data.location.saplings)){
                        var planttime = 0
                        var plantname = `Nothting`
                        var plantdate = `Not yet planted`
                        if (value !== null){

                         plantdate = new Date(value.time);
                         planttime = Math.round((new Date()-value.time)/86400000);
                         var plantid = value.id 
                            for (var i = 0; i < itemlist.length; i++){
                                if (itemlist[i].id == value.id){
                                 plantname = itemlist[i].name  
                                }
                            }
                        };    

                        embed.addField(`__${key} - Set ${planttime} days ago.__`,`Seed Planted: **${plantname}**\nPlanted Since: ${plantdate}`,false);
                    
                    }
            message.channel.send({embed})
            }) 
    }).catch(err => {
        message.reply("Error you must enter a valid UserID or User Mention")
        })
};    