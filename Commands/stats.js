exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    const apikey = require("./../config.json");
    const request = require('request');
    const locationdb = require("./../Data/drpglocationlist.json");
    var usrid = message.author.id;
        if(args.length > 0){
            usrid = message.mentions.members.size > 0 ? message.mentions.members.first().id : args[0];
        };
    client.fetchUser(usrid).then((user) => {
                 
            request({uri:`http://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body) {
            if (err) return;
            const data = JSON.parse(body);
            var xpBoostpercent = (data.attributes !== undefined) ? Math.floor(data.attributes.xpBoost / 10) : "Old Player" ;
            var goldBoostpercent = (data.attributes !== undefined) ? Math.floor(data.attributes.goldBoost / 10) : "Old Player" ;
            var playdate = Math.floor((new Date()-data.lastseen)/60000);
            var donator = data.donate ? `Yes` : `No`
            var completedquest = (data.quest == null ) ? `None`: data.quest.completed.join(`, `)
            var questpoints = (data.questPoints == undefined) ? `0`: data.questPoints
            var lux = (data.lux == undefined) ? `0` : data.lux
            var petxprate =(data.pet.xprate == undefined) ? `0` : data.pet.xprate
            var locationname = data.location.current 
                            for (var i = 0; i < locationdb.length; i++){
                                if (locationdb[i].id == data.location.current){
                                 locationname = locationdb[i].name  
                                }
                            }
                const embed = new Discord.RichEmbed()
                .setTitle(data.name + "'s DRPG Info")
                .setAuthor(message.author.username,message.author.avatarURL)
                .setColor(0x00AE86)
                .setDescription(`Donator - ${donator}\nLast seen ${playdate} mins ago.\nCurrently In ${locationname}`)
                .addField(`Level - ${data.level}`,`Kills - ${data.kills} | Deaths - ${data.deaths}\nXP - ${data.xp} | XPBoost - ${xpBoostpercent}%`,false)
                .addField(`Gold - ${data.gold}`,`Lux - ${lux} | Gold Boost  - ${goldBoostpercent}%`,false)
                .addField(`Skills`,`Chop - Lvl.${data.skills.chop.level} / Fish - Lvl.${data.skills.fish.level} / Forage - Lvl.${data.skills.forage.level} / Mine - Lvl.${data.skills.mine.level}`,false)
                .addField(`Pet - ${data.pet.name} | ${data.pet.type}`,`Level - ${data.pet.level} | Damage - ${data.pet.damage.min}-${data.pet.damage.max}\nXP - ${data.pet.xp} | XPRate - ${petxprate}%`,false)
                if (data.quest !== ''){
                embed.addField(`Quest Completed - ${questpoints}`,`${completedquest}`,false)
            };
                message.channel.send({embed})
                
        }) 
    }).catch(err => {
        message.reply("Error you must enter a valid UserID or User Mention")
        })
    };    
    
    
    
    
        
    



     
    
    //message.mentions.members.size > 0 ? message.mentions.members.first().id : args[0];
    //.addField(`Plant Info`,data.location.saplings["1"].time,false) 


    