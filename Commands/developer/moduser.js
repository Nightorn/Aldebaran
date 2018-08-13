const poolQuery = require('./../../functions/database/poolQuery');
const config = require("./../../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");
exports.run = function(bot, message, args) {
    if (message.author.id != `310296184436817930`)return message.reply(`What makes you think you can do that?\nUse &uconfig to change your settings. `)
    const parametersAvailable = {
        healthMonitor: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 || (parseInt(value) > 0 && parseInt(value) < 100) }, help: "DiscordRPG Health Monitor - [on | off | healthPercentage]"},
        adventureTimer: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, help: "DiscordRPG Adventure Timer - [on | off]"},
        sidesTimer: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, help: "DiscordRPG Sides Timer - [on | off]"}
    }
    if (args.length == 0 || args.indexOf('help') != -1) {
        var description = '';
        for (let [key, data] of Object.entries(parametersAvailable)) description += `**${key}** - ${data.help}\n`;
        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle('Config Command Help Page')
            .setDescription(`Here are the different parameters you can change to have a better experience of ${bot.user.username}\n(Note: If setting is disabled in &gconfig by guild owner, these settings will be ignored.\n**__Usage Example__** : \`&uconfig healthMonitor off\`\n${description}\n`)
            .setColor('BLUE');
        message.channel.send({embed});
    } else {
        if (Object.keys(parametersAvailable).indexOf(args[0]) != -1) {
            if (parametersAvailable[args[0]].support(args[1])) {
                const connect = function() {
                    poolQuery(`SELECT * FROM users WHERE userId='${args[2]}'`).then(result => {
                        if (Object.keys(result).length == 0) {
                            poolQuery(`INSERT INTO users (userId, settings) VALUES ('${args[2]}', '{}')`).then(() => {
                                connect();
                            });
                        } else {
                            let settings = JSON.parse(result[0].settings);
                            settings[args[0]] = args[1];
                            poolQuery(`UPDATE users SET settings='${JSON.stringify(settings)}' WHERE userId='${args[2]}'`).then(() => {
                                const embed = new Discord.RichEmbed()
                                    .setAuthor(message.author.username, message.author.avatarURL)
                                    .setTitle(`Settings successfully changed`)
                                    .setDescription(`The property **${args[0]}** has successfully been changed to the value **${args[1]}**. For user **${args[2]}**.`)
                                    .setColor(`GREEN`);
                                message.channel.send({embed});
                            }).catch(() => {
                                const embed = new Discord.RichEmbed()
                                    .setAuthor(message.author.username, message.author.avatarURL)
                                    .setTitle(`An Error Occured`)
                                    .setDescription(`An error occured and we could not change your settings. Please retry later.`)
                                    .setColor(`RED`);
                                message.channel.send({embed});
                            });
                        }
                    });
                }
                connect();
            } else {
                message.channel.send(`**Error** This value is not supported, check \`&config help\` for more informations.`);
            }
        } else {
            message.channel.send(`**Error** This key does not exist, check \`&config help\` for more informations.`);
        }
    }
}
exports.infos = {
    category: "Developer",
    description: "Modifies a users uconfig settings",
    usage: "\`&moduser <parameter> <setting> <userid>\`",
    example: "\`&moduser adventureTimer on 320933389513523220\`",
    restrictions: "Developer Only"
}
