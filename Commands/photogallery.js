const poolQuery = require('./../functions/database/poolQuery');
const config = require("./../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");
exports.run = function(bot, message, args) {
    var imagenumber = (args != "")? args[0] : 0
    const connect = function() {
        poolQuery(`SELECT * FROM photogallery WHERE userId='${message.author.id}'`).then(result => {
            let image = result[parseInt(imagenumber)];
            message.channel.send(image.links)
        }).catch(() => {
            const embed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`An Error Occured`)
                .setDescription(`An error occured and we could not retrive photos you specifed. Please retry later.`)
                .setColor(`RED`);
            message.channel.send({embed});
        })
    }
    connect()
}
exports.infos = {
    category: "General",
    description: "Shows your Photogallery",
    usage: "\`&photogallery\`",
    example: "\`&photogallery\`",
}