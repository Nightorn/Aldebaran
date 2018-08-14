exports.run = (bot, message, args) => {
    const poolQuery = require(`${process.cwd()}/functions/database/poolQuery`);
    const Discord = require('discord.js');
    if (message.author.id === '310296184436817930' || message.author.id === '320933389513523220') {
        if (args[0] === 'view') {
            var id = message.mentions.members.size === 1 ? message.mentions.members.first().id : args[1];
            bot.fetchUser(id).then(async user => {
                const warningsDetection = [
                    (settings) => { if (settings.individualHealthMonitor !== 'off' && settings.healthMonitor === 'off') return ':warning: **individualHealthMonitor** is on, but **healthMonitor** is disabled'; }
                ]
                var dbResult = await poolQuery(`SELECT * FROM users WHERE userId='${user.id}'`), warnings = [], guilds = [];
                const embed = new Discord.RichEmbed()
                    .setAuthor(`${user.tag} | ${user.id}`, user.avatarURL);
                if (dbResult[0] !== undefined) {
                    const parsedSettings = JSON.parse(dbResult[0].settings);
                    for (let element of warningsDetection) if (element(parsedSettings) !== undefined) warnings.push(element(parsedSettings));
                    embed.addField('Settings', `\`\`\`js\n${require('util').inspect(parsedSettings, false, null)}\`\`\``);
                    if (warnings.length > 0) embed.addField(`Warnings`, warnings.join('\n'));
                }
                for (let [id, data] of bot.guilds) if (data.members.get(user.id) !== undefined) guilds.push(`\`${id}\` **${data.name}** ${data.ownerID === user.id ? '(Owner)' : ''}`);
                if (guilds.length > 0) embed.addField('Servers', guilds.join('\n'));
                message.channel.send({embed});
            }).catch(async () => {
                if (bot.guilds.get(id) !== undefined) {
                    var guild = bot.guilds.get(id);
                    var dbResult = await poolQuery(`SELECT * FROM guilds WHERE guildid='${guild.id}'`), warnings = [], guilds = [];
                    var guildOwner = await bot.fetchUser(guild.ownerID);
                    const embed = new Discord.RichEmbed()
                        .setAuthor(`${guild.name} | ${guild.id}`, guild.iconURL)
                        .setDescription(`**Owner** : <@${guildOwner.id}> **\`[${guildOwner.tag}]\`**`);
                    if (dbResult[0] !== undefined) {
                        const parsedSettings = JSON.parse(dbResult[0].settings);
                        embed.addField('Settings', `\`\`\`js\n${require('util').inspect(parsedSettings, false, null)}\`\`\``);
                    }
                    message.channel.send({embed});
                } else {
                    const embed = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setTitle('Warning')
                        .setDescription(`The ID specified does not correspond to a valid user or a guild where ${bot.user.username} is.`)
                        .setColor(`ORANGE`);
                    message.channel.send({embed});
                }
            });
        } else if (args[0] === 'clear') {
            var id = message.mentions.members.size === 1 ? message.mentions.members.first().id : args[1];
            bot.fetchUser(id).then(async user => {
                message.channel.send(`**${message.author.username}**, are you sure you want to clear the data of **${user.username}**?`).then(msg => {
                    msg.react('✅');
                    const check = (reaction, user) => { return reaction.emoji.name === '✅' && user.id === message.author.id };
                    msg.awaitReactions(check, { time: 30000, max: 1 }).then(() => {
                        poolQuery(`DELETE FROM users WHERE userId='${user.id}'`).then(() => {
                            message.channel.send(`The user data of **${user.username}** has been successfully deleted.`);
                        });
                    }).catch(() => {
                        msg.clearReactions().catch(() => {});
                    });
                });
            }).catch(() => {
                const embed = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setTitle('Warning')
                    .setDescription(`The ID specified does not correspond to a valid user.`)
                    .setColor(`ORANGE`);
                message.channel.send({embed});
            });
        }
    }
}

exports.infos = {
    category: "Developer",
    description: "Admin Portal Command",
    usage: "\`&admin\`",
    example: "\`&admin\`"
}