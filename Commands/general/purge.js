const Discord = require('discord.js');
exports.run = (bot, message, args) => {
    if (!message.member.permissionsIn(message.channel).has('MANAGE_MESSAGES')) return message.channel.send({embed: {title: ":x: No permission", description: `${message.author.username} does not have permission to purge the channel. (Need Manage_messages)`}}) 
    let messageCount = (args[0] > 1) ? Math.floor(parseInt(args[0])) : 1;
    message.channel.bulkDelete(messageCount).then(() => {
        message.channel.send(":ok_hand: Purged "+messageCount+" messages").then(msg => {
            msg.delete({ timeout: 10000, reason: `${message.author.tag} | Purged ${messageCount} messages` });
        });
    }).catch(() => {
        message.reply('an error occured and the command could not run properly.');
    });
}
    
exports.infos = {
    category: "General",
    description: "Purges Set Amount Of Messages",
    usage: "\`&purge <amount>\`",
    example: "\`&pruge 15\`",
}

