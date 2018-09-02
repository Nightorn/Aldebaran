const { MessageEmbed } = require('discord.js');
exports.run = (bot, message, args) => {
    if (message.author.id === '310296184436817930' || message.author.id === '320933389513523220') {
        if (args[0] === 'view') {
            require('./admin/view')(bot, message, args);
        } else if (args[0] === 'clear') {
            require('./admin/clear')(bot, message, args);
        } else if (args[0] === 'mod') {
            require('./admin/mod')(bot, message, args);
        } else {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setTitle('Warning')
                .setDescription(`The admin action specified is invalid.`)
                .setColor(`ORANGE`);
            message.channel.send({embed});
        }
    }
}

exports.infos = {
    category: "Developer",
    description: "Admin Portal Command",
    usage: "\`&admin\`",
    example: "\`&admin\`"
}