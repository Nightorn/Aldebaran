const { MessageEmbed } = require('discord.js');
const fs = require('fs');
exports.run = function(bot, message) {
    var commands = {};
    for (let [key, value] of bot.commandHandler.commands) {
        if (value.category !== 'Developer' && value.category !== 'NSFW') {
            if (commands[value.category] === undefined) commands[value.category] = [];
            commands[value.category].push(key);
        }
    }
    var embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle(`Commands Listing of ${bot.user.username}`)
        .setThumbnail(bot.user.avatarURL());
    for (let [category, array] of Object.entries(commands)) {
        embed.addField(`__${category}__`, array.join(', '), true);
    }
    message.channel.send({embed});
}

exports.infos = {
    category: "General",
    description: "Lists all the available commands",
    usage: "\`&commands`",
    example: "\`&commands`",
}