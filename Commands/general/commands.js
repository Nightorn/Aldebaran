const { RichEmbed } = require('discord.js');
const fs = require('fs');
exports.run = function(bot, message) {
    var commands = {};
    const storeCommand = function(fileName, command) {
        if (command.infos == undefined) return;
        if (commands[command.infos.category] == undefined) commands[command.infos.category] = [];
        commands[command.infos.category].push(`*${fileName.replace('.js', '')}*`);
        return commands;
    }
    const rootCommands = fs.readdirSync('./Commands');
    for (let fileName of rootCommands) {
        if (fs.statSync(`./Commands/${fileName}`).isDirectory()) {
            const dirCommands = fs.readdirSync(`./Commands/${fileName}`);
            let dirName = fileName;
            for (let fileName of dirCommands) {
                if (dirName != 'In Progress Commands') storeCommand(fileName, require(`./${dirName}/${fileName}`));
            }
        } else {
            storeCommand(fileName, require(`./${fileName}`));
        }
    }

    var embed = new RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`Commands Listing of ${bot.user.username}`)
        .setThumbnail(bot.user.avatarURL);
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