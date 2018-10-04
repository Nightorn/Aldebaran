module.exports = function(bot, message, args) {
    return new Promise((resolve, reject) => {
        if (message.mentions.members.size > 0) {
            resolve(message.mentions.members.first().id);
        } else if (args[0] !== undefined) {
            const userId = args[0];
            bot.users.fetch(userId).then((user) => {
                if (user !== undefined) {
                    resolve(userId);
                } else {
                    reject(new RangeError('Invalid User ID'));
                }
            });
        } else {
            const userId = message.author.id;
            resolve(userId);
        }
    });
}