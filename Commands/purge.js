const Discord = require('discord.js');
exports.run = (bot, message, args) => {
    if (message.author.id != `310296184436817930`)return message.reply(`Who said you could touch me there?`) 
        let messageCount = (args[0] > 1) ? Math.floor(parseInt(args[0])) : 1
        message.channel.fetchMessages({limit: messageCount})
        .then(messages => {
            message.channel.bulkDelete(messages)
        }) 
    message.delete()
    }
    exports.infos = {
        category: "General",
        description: "Purges Set Amount Of Messages",
        usage: "\`&purge <amount>\`",
        example: "\`&pruge 15\`",
        restrictions: "Developer Only"
    }

