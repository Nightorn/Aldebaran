const poolQuery = require('./../functions/database/poolQuery');
const config = require("./../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");

exports.run = function(bot, message, args) {
    
    const connect = function() {
        var maximage = 0;
        poolQuery(`SELECT COUNT(*) FROM photogallery WHERE NSFW != "Yes"`).then(result =>{
            maximage = parseInt(result[0]["COUNT(*)"]) -1 
        }).catch(() => {
        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle(`An Error Occured`)
            .setDescription(`An error occured and we could not retrive photos you specifed. Please retry later.`)
            .setColor(`RED`);
        message.channel.send({embed});
        })

        poolQuery(`SELECT * FROM photogallery WHERE NSFW != "Yes"`).then(result => {
            let imagenumber = Math.ceil((Math.random() * maximage))
            let image = result[parseInt(imagenumber)];
            console.log(imagenumber)
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
    description: "Returns Random Image From Gallery",
    usage: "\`&randomphoto\`",
    example: "\`&randomphoto\`",
}