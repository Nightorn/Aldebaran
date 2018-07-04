const poolQuery = require('./../../functions/database/poolQuery');
module.exports = (client, message) => {
    if ((message.content.indexOf('padv') > 0 && message.content.indexOf('padv') <= 3) || message.content.toLowerCase().indexOf('discordrpg') == 0) {
        poolQuery(`SELECT settings FROM guilds WHERE guildId='${message.guild.id}'`).then(result => {
            if (Object.keys(result).length != 0) {
                let settings = JSON.parse(result[0].settings);
                if (settings.adventureTimer === 'on') {
                    poolQuery(`SELECT settings FROM users WHERE userId='${message.author.id}'`).then(result => {
                        if (Object.keys(result).length != 0) {
                            let settings = JSON.parse(result[0].settings);
                            if (settings.adventureTimer === 'on') {
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