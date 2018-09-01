const { MessageEmbed } = require('discord.js');
module.exports = (bot, message, args) => {
    var id = message.mentions.members.size === 1 ? message.mentions.members.first().id : args[1];
    const user = bot.users.get(id);
    const guild = bot.guilds.get(id);
    var dataInfos = {};
    if (user !== undefined) {
        dataInfos.type = 'user';
        dataInfos.warning = `**${message.author.username}**, are you sure you want to clear the data of **${user.username}**?`;
        dataInfos.message = `The user data of **${user.username}** has been successfully deleted.`;
        dataInfos.function = user.clear;
    } else {
        if (guild !== undefined) {
            dataInfos.type = 'guild';
            dataInfos.warning = `**${message.author.username}**, are you sure you want to clear the data of **${guild.name}**?`;
            dataInfos.message = `The guild data of **${guild.name}** has been successfully deleted.`;
            dataInfos.function = guild.clear;
        } else {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setTitle('Warning')
                .setDescription(`The ID specified does not correspond to a valid user or a guild where ${bot.user.username} is.`)
                .setColor(`ORANGE`);
            message.channel.send({embed});
        }
    }
    if (dataInfos.type !== undefined) {
        message.channel.send(dataInfos.warning).then(msg => {
            msg.react('✅');
            const check = (r, u) => { return r.emoji.name === '✅' && u.id === message.author.id };
            msg.awaitReactions(check, { time: 30000, max: 1 }).then(() => {
                dataInfos.function(dataInfos.type === 'user' ? user.id : guild.id).then(() => {
                    message.channel.send(dataInfos.message);
                });
            }).catch(() => {
                msg.reactions.removeAll().catch(() => {});
            });
        });
    }
}