const poolQuery = require('./../functions/database/poolQuery');
const Discord = require('discord.js');
const util = require('util');
exports.run = function(bot, message, args) {
    if ((message.author.id === '320933389513523220') || (message.author.id === '310296184436817930')){
        try {
            poolQuery(args.join(' ')).then(result => {
                message.channel.send(util.inspect(result, false, null), {code:"xl"}).catch(err => {
                    const embed = new Discord.RichEmbed()
                        .setTitle(`Message Sending Error`)
                        .addField(`Code`, err.code, true)
                        .addField(`Path`, err.path, true)
                        .setColor('RED');
                    message.channel.send({embed});
                })
            }).catch(err => {
                message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
            });
        } catch (err) {
        }
    } else message.reply("NO U")

}