const locationinfo = require(`${process.cwd()}/Data/drpglocationlist.json`);
module.exports = function(bot, message) {
    const userName = message.content.substring(0, message.content.indexOf("started")).trim();
    const user = bot.users.find(u => u.username === userName);
    if (user !== undefined) {
        if (user.timers.travel !== null | user.settings.travelTimer === 'off') return;
        if (message.content.indexOf("started their journey to") !== -1) {
            var locationName = message.content.slice(message.content.indexOf("to")+2).trim().split("!");
            for (let [id, data] of Object.entries(locationinfo)) {
                if (data.name === locationName[0] && data.traveltime !== undefined) {
                    user.timers.travel = setTimeout((locationName, message, user) => {
                        user.timers.travel = null;
                        message.channel.send(`<@${user.id}> has arrived at ${locationName} better lock your doors!!`).then(msg => {
                            if (message.guild.settings.autoDelete !== 'off') msg.delete({ timeout: 60000 });
                        });
                    }, data.traveltime * 1000, locationName, message, user);
                }
            }
        }
    }
}

    

        
            
                
                

