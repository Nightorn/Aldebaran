const Discord = require("discord.js");
module.exports = function(bot, message, args) {
    return new Promise((resolve, reject) => {
        if (message.mentions.members.size > 0) {
            const userId = message.mentions.members.first().id;
            bot.fetchUser(userId).then(() => {
                resolve(userId);
            }).catch(() => {
                reject(new RangeError('Invalid User ID'));
            });
        }
        else if (args[0]){
            const userId = args[0]
            bot.fetchUser(userId).then(() => {
                resolve(userId);
            }).catch(() => {
                reject(new RangeError('Invalid User ID'));
            });
        }
        else {
            const userId = message.author.id
            resolve(userId)           
       }
    });
}