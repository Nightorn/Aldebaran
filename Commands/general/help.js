exports.run = (bot, message, args) => {
    const fs = require('fs');
    const { RichEmbed } = require('discord.js');
    if (args[0] != undefined) {
        let commands = {};
        var files = fs.readdirSync(`${process.cwd()}/Commands/`);
            
        const set = (path) => {
            let file = require(path).infos;
            if (!file) {
                console.log(`No information for ${path}, skipping`);
                return;
            }; 

            if (path.split('/').pop().split('.')[0] == args[0].toLowerCase()) {
                commands = file;
            } else if (typeof commands === 'object' && args[0].toLowerCase() === file.category.toLowerCase()) {
                if (commands[file.category.toLowerCase()] == undefined) commands[file.category.toLowerCase()] = new Map();
                commands[file.category.toLowerCase()].set(path.split('/').pop().split('.')[0], file.description);
            }
        }

        for (let fileName of files) {
            if (fs.statSync(`${process.cwd()}/Commands/${fileName}`).isDirectory()) {
                let dirName = fileName;
                files = fs.readdirSync(`${process.cwd()}/Commands/${dirName}/`);
                for (let fileName of files) {
                    if (dirName !== 'inProgress') set(`${process.cwd()}/Commands/${dirName}/${fileName}`);
                }
            } else {
                set(`${process.cwd()}/Commands/${fileName}`);
            }
        }
    
        if (commands[args[0].toLowerCase()] instanceof Map) {
            if (commands[args[0].toLowerCase()].size > 0) {
                var list = ``, category = require(`${process.cwd()}/Data/categories.json`)[args[0].toLowerCase()];
                for (let [command, description] of commands[args[0].toLowerCase()]) list += `:small_blue_diamond: **${command}** : ${description}\n`;
                const embed = new RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setTitle(`__**${category.title}**__`)
                    .setDescription(`${category.description}\n${list}`)
                    .setColor('BLUE');
                message.channel.send({embed});
            } else {
                message.channel.send(`**Error** No command of the specified category was found. Get a list of all available commands with \`&commands\`.`);
            }
        } else if (typeof commands === 'object' && commands.category !== undefined) {
            const embed = new RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`Details of the ${args[0].toLowerCase()} Command`)
                .setDescription(commands.description)
                .addField(`Category`, commands.category, true)
                .addField(`Usage`, commands.usage, true)
                .addField(`Example`, commands.example, true)
                .setColor(`BLUE`);
            message.channel.send({embed});
        } else {
            message.channel.send(`**Error** No command was found. Get a list of all available commands with \`&commands\`.`);
        }
    } else {
        var embed = new RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle(`Aldebaran's Help Pages`)
            .setDescription(`Below are the different categories, each of them contains a list of commands which you can see with \`&help [category name]\`. You can get a brief overview of all available commands with \`&commands\`.`)
            .setFooter(`This bot is currently in development by Nightmare#1234`);
        for (let [category, data] of Object.entries(require(`${process.cwd()}/Data/categories.json`))) embed.addField(`__**${data.title}**__`, data.description, true);
        embed.addField(`**__Have a command request or suggestion?__**`, `Join our support server here by clicking [right here](https://discord.gg/3x6rXAv)!`, true);
        message.channel.send({embed});
    }
}

exports.infos = {
    category: "General",
    description: "Displays Detailed Help Info",
    usage: "\`&help\`",
    example: "\`&help\`",
}