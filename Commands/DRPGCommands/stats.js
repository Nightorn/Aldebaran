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
            apiratelimit = response.headers["x-ratelimit-remaining"]
            var ratelimitrest = Math.floor(parseInt(response.headers["x-ratelimit-reset"] - (Date.now()/1000)))
            var xpBoostpercent = (data.attributes !== undefined) ? Math.floor(data.attributes.xpBoost / 10) : 0 ;
            var goldBoostpercent = (data.attributes !== undefined) ? Math.floor(data.attributes.goldBoost / 10) : 0 ;
            var playdate = Math.floor((new Date()-data.lastseen)/60000);
            var donator = data.donate ? `Yes` : `No`
            var completedquest = (data.quest == null || data.quest == "" || data.quest.accept !== undefined ) ? `None`: data.quest.completed.join(`, `)
            var questpoints = (data.questPoints == undefined) ? `0`: data.questPoints
            var lux = (data.lux == undefined) ? `0` : data.lux
            var petxprate =(data.pet == undefined || data.pet.xprate == undefined ) ? `0` : data.pet.xprate
            var locationname = (data.loction !== undefined) ? data.location.current : "The Abyss";
                        if(data.location !== undefined){    
                            for (var i = 0; i < locationdb.length; i++){
                                if (locationdb[i].id == data.location.current){
                                 locationname = locationdb[i].name  
                                } 
                            }
                        }    
                const embed = new Discord.RichEmbed()
                .setTitle(data.name + "'s DRPG Info")
                .setAuthor(message.author.username,message.author.avatarURL)
                .setColor(0x00AE86)
                .setDescription(`Donator - ${donator}\nLast seen ${playdate} mins ago.\nCurrently In ${locationname}`)
                .setFooter(`${apiratelimit} Global Uses Remain Before Ratelimited | Usages Reset In ${ratelimitrest} seconds.`)
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


    