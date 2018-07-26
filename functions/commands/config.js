const poolQuery = require('./../../functions/database/poolQuery');
module.exports = (parametersAvailable, type, message) => {
    const { RichEmbed } = require('discord.js');
    const args = message.content.split(' '); args.shift();
    if (Object.keys(parametersAvailable).indexOf(args[0]) != -1) {
        if (parametersAvailable[args[0]].support(args[1])) {
            const connect = function() {
                poolQuery(`SELECT * FROM ${type === 'user' ? `users WHERE userId='${message.author.id}'` : `guilds WHERE guildid='${message.guild.id}'`}`).then(result => {
                    if (Object.keys(result).length == 0) {
                        poolQuery(`INSERT INTO ${type === 'user' ? `users (userId, settings) VALUES ('${message.author.id}` : `guilds (guildid, settings) VALUES ('${message.guild.id}`}', '{}')`).then(() => {
                            connect();
                        });
                    } else {
                        let settings = JSON.parse(result[0].settings);
                        settings[args[0]] = args[1];
                        poolQuery(`UPDATE ${type}s SET settings='${JSON.stringify(settings)}' WHERE ${type === 'user' ? 'userId': 'guildid'}='${message.author.id}'`).then(() => {
                            if (parametersAvailable[args[0]].postUpdate !== undefined) parametersAvailable[args[0]].postUpdate(args[1]);
                            const embed = new RichEmbed()
                                .setAuthor(message.author.username, message.author.avatarURL)
                                .setTitle(`Settings successfully changed`)
                                .setDescription(`The property **${args[0]}** has successfully been changed to the value **${args[1]}**.`)
                                .setColor(`GREEN`);
                            message.channel.send({embed});
                        }).catch(() => {
                            const embed = new RichEmbed()
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
            message.channel.send(`**Error** This value is not supported, check \`&${type === 'users' ? 'u' : 'g'}config help\` for more informations.`);
        }
    } else {
        message.channel.send(`**Error** This key does not exist, check \`&${type === 'users' ? 'u' : 'g'}config help\` for more informations.`);
    }
}