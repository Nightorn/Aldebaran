const poolQuery = require('./../functions/database/poolQuery');
const config = require("./../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");
exports.run = function(bot, message, args) {
    if (['310296184436817930', '320933389513523220', message.guild.ownerID].indexOf(message.author.id) == -1) return message.reply(`How about you not do that!`);
    const parametersAvailable = {
        adventureTimer: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, help: "DiscordRPG Adventure Timer - [on | off]"},
        sidesTimer: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, help: "DiscordRPG Sides Timer - [on | off]"},
        autoDelete: {support: (value) => { return ['on', 'off'].indexOf(value) != -1}, help: "Auto Delete Sides & Adv Commands - [on | off]"},
        aldebaranPrefix: {support: (value) => {return ['&',`${args[1]}`].indexOf(value) != -1}, help: "Aldebaran's Prefix - [& | Guild Customized]", postUpdate: (value) => { bot.prefixes.set(message.guild.id, value); }}
    }
    if (args.length == 0 || args.indexOf('help') != -1) {
        var description = '';
        for (let [key, data] of Object.entries(parametersAvailable)) description += `**${key}** - ${data.help}\n`;
        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle('Config Command Help Page')
            .setDescription(`Here are the different parameters you can change to set the experience and the limitations of the members of your server.\n**Usage Example:** \`&gconfig adventureTimer off\`.\n__Note:__ This command can only be used by the owner of the server.\n${description}`)
            .setColor('BLUE');
        message.channel.send({embed});
    } else {
        if (Object.keys(parametersAvailable).indexOf(args[0]) != -1) {
            if (parametersAvailable[args[0]].support(args[1])) {
                const connect = function() {
                    poolQuery(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`).then(result => {
                        if (Object.keys(result).length == 0) {
                            poolQuery(`INSERT INTO guilds (guildid, settings) VALUES ('${message.guild.id}', '{}')`).then(() => {
                                connect();
                            });
                        } else {
                            let settings = JSON.parse(result[0].settings);
                            settings[args[0]] = args[1];
                            poolQuery(`UPDATE guilds SET settings='${JSON.stringify(settings)}' WHERE guildid='${message.guild.id}'`).then(() => {
                                if (parametersAvailable[args[0]].postUpdate !== undefined) parametersAvailable[args[0]].postUpdate(args[1]);
                                const embed = new Discord.RichEmbed()
                                    .setAuthor(message.author.username, message.author.avatarURL)
                                    .setTitle(`Settings successfully changed`)
                                    .setDescription(`The property **${args[0]}** has successfully been changed to the value **${args[1]}**.`)
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
                message.channel.send(`**Error** This value is not supported, check \`&gconfig help\` for more informations.`);
            }
        } else {
            message.channel.send(`**Error** This key does not exist, check \`&gconfig help\` for more informations.`);
        }
    }
}
exports.infos = {
    category: "Settings",
    description: "Used to enabled or disable features of aldebaran.",
    usage: "\`&gconfig <parameter> <setting>\`",
    example: "\`&gconfig adventureTimer on\`",
    restrictions: "Server Owner"
}