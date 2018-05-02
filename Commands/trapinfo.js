exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    const apikey = require("./../config.json");
    const request = require('request');
    var usrid = message.author.id;
        if(args.length > 0){
            usrid = message.mentions.members.size > 0 ? message.mentions.members.first().id : args[0];
        };
    client.fetchUser(usrid).then((user) => {
                 
            request({uri:`http://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body) {
            if (err) return;
            const data = JSON.parse(body);
            var trapdate = new Date(data.trap.time);
            var playdate = Math.floor((new Date()-data.lastseen)/60000);
            var trapelapsed = Math.round((new Date()-data.trap.time)/3600000);
            const embed = new Discord.RichEmbed()
                .setTitle(data.name + "'s Trap Info")
                .setAuthor(message.author.username,message.author.avatarURL)
                .setColor(0x00AE86)
                .setDescription(`It's a trap.`)
                .addField(`Bear Trap - Set ${trapelapsed} Hours Ago`,`Trap Set - ${trapdate}`,false)
                message.channel.send({embed})
                
            }) 
    }).catch(err => {
        message.reply("Error you must enter a valid UserID or User Mention")
        })
};    
    
    
    
    
        
    



     
    
    //message.mentions.members.size > 0 ? message.mentions.members.first().id : args[0];
     


    