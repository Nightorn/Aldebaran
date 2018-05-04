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
            const embed = new Discord.RichEmbed()
                .setTitle(data.name + "'s Planting Info")
                .setAuthor(message.author.username,message.author.avatarURL)
                .setColor(0x00AE86)
                .setDescription(`**Please note all infomation about amounts are strictly estimates!!**`)
                    for (let [key, value] of Object.entries(data.location.saplings)){
                        var planttime = 0
                        var checktime = 0
                        var plantname = `Nothting`
                        var plantdate = `Not yet planted`
                        var lootamountcurrentmin = `NA`
                        var lootamountcurrentmax = `NA`
                        var lootamountmaxmin = `NA`
                        var lootamountmaxmax = `NA`
                        var currentreap = data.attributes.reaping !== 0 ? data.attributes.reaping : 1;
                        var maxreap = Math.round(data.level * 5);
                        if (value !== null){

                         plantdate = new Date(value.time);
                         planttime = Math.round((new Date()-value.time)/86400000);
                         checktime = Math.round((new Date()-value.time)/1000);
                         lootamountcurrentmin = Math.floor(1+((Math.floor(currentreap))*(checktime/25)/15000));
                         lootamountcurrentmax = Math.floor(1+((Math.floor(currentreap))*(checktime/25)/14000));
                         lootamountmaxmin = Math.floor(1+(maxreap*(checktime/25)/15000));
                         lootamountmaxmax = Math.floor(1+(maxreap*(checktime/25)/14000));
                         var plantid = value.id 
                            for (var i = 0; i < itemlist.length; i++){
                                if (itemlist[i].id == value.id){
                                 plantname = itemlist[i].name  
                                }
                            }
                        };    

                        embed.addField(`__${key} - Set ${planttime} days ago.__`,`Seed Planted: **${plantname}**\nPlanted Since: ${plantdate}\nChecked with **Current** reaping would give you **${lootamountcurrentmin} - ${lootamountcurrentmax} items**.\nChecked with **Max** reaping would give you **${lootamountmaxmin} - ${lootamountmaxmax} items**.`,false);
                    
                    }
            message.channel.send({embed})
            }) 
    }).catch(err => {
        message.reply("Error you must enter a valid UserID or User Mention")
        })
};    