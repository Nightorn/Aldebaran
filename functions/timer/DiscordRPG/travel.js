const Discord = require("discord.js");
const locationinfo = require(`${process.cwd()}/Data/drpglocationlist.json`)
module.exports = function(bot, message) {
    if (message.content.indexOf("started their journey to") !== -1){
        var locationName = message.content.slice(message.content.indexOf("to")+2).trim().split("!");
        var userName = message.content.substring(0,message.content.indexOf("started")).trim()
        const user = bot.users.find('username',userName)
        for (var i = 1; i < 46; i++){
            if (locationinfo[i].name == locationName[0]){
                if(locationinfo[i].traveltime !== undefined){
                    setTimeout((channel, userid) => {
                        message.channel.send(`<@${user.id}> has arrived at ${locationName} better lock your doors!!`)
                    },locationinfo[i].traveltime * 1000, message.channel, user.id)
                }else return;
            }
        }
    }
}