const Discord = require("discord.js");
const locationinfo = require(`${process.cwd()}/Data/drpglocationlist.json`);
const poolQuery = require(`${process.cwd()}/functions/database/poolQuery`);
module.exports = function(bot, message, args,traveltimer) {
    if (message.content.indexOf("started their journey to") !== -1){
        var locationName = message.content.slice(message.content.indexOf("to")+2).trim().split("!");
        var userName = message.content.substring(0,message.content.indexOf("started")).trim()
        const user = bot.users.find('username',userName)
        const timer = function(){
            if (bot.traveltimer.has(user.id))return;
            poolQuery(`SELECT * FROM users WHERE userId= '${user.id}'`).then((result) =>{
                for (var i = 1; i < 46; i++){
                   if (locationinfo[i].name == locationName[0]){
                        if(locationinfo[i].traveltime !== undefined){
                            if (Object.keys(result).length != 0){
                                let settings = JSON.parse(result[0].settings)
                                if (settings.travelTimer === `on`){
                                    bot.traveltimer.set(user.id)
                                    setTimeout((channel, userid) => {
                                        message.channel.send(`<@${user.id}> has arrived at ${locationName} better lock your doors!!`)
                                        bot.traveltimer.delete(user.id)
                                    },locationinfo[i].traveltime * 1000, message.channel, user.id)
                                }
                            }
                        }
                    }
                }
            }).catch()
        }                            
        timer()
    } else return;
}

    

        
            
                
                

