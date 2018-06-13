const config = require('./../config.json');
const Discord = require('discord.js');
const mysql = require('mysql');
const util = require('util');
exports.run = function(bot, message, args) {
    try {
        var con = mysql.createPool({
          host : config.mysqlHost,
          user : config.mysqlUser,
          password : config.mysqlPass,
          database : config.mysqlDatabase
        });
        con.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(args.join(' '), (err, result) => {
                if (err) {
                    message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
                } else {
                    message.channel.send(util.inspect(result, false, null), {code:"xl"}).catch(err => {
                        const embed = new Discord.RichEmbed()
                            .setTitle(`Message Sending Error`)
                            .addField(`Code`, err.code, true)
                            .addField(`Path`, err.path, true)
                            .setColor('RED');
                        message.channel.send({embed});
                    })
                }
            });
        });
    } catch (err) {
        message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
    }
}