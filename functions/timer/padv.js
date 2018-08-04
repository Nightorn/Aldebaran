const poolQuery = require('./../../functions/database/poolQuery');
module.exports = (client, message) => {
    if (message.content.toLowerCase().startsWith(`#!padv`)|| message.content.toLowerCase().startsWith(`,padv`)|| message.content.toLowerCase().startsWith(`.padv`)){
        poolQuery(`SELECT settings FROM guilds WHERE guildId='${message.guild.id}'`).then(result => {
            if (Object.keys(result).length != 0) {
                let settingsg = JSON.parse(result[0].settings);
                if (settingsg.adventureTimer !== 'off') {
                    poolQuery(`SELECT settings FROM users WHERE userId='${message.author.id}'`).then(result => {
                        if (Object.keys(result).length != 0) {
                            let settings = JSON.parse(result[0].settings);
                            if (settings.adventureTimer !== 'off') {
                                message.delete(1000);
                                setTimeout((channel, userid) => {
                                    message.channel.send("<@" + message.author.id + "> Party Time! :tada:");
                                }, 19000, message.channel, message.author.id)
                            }
                        }
                    });
                }
            }
        });
    }
}