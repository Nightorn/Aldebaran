const poolQuery = require('./../functions/database/poolQuery');
const config = require("./../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");
exports.run = function(bot, message, args) {
    const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle()
        .setDescription(`Please specify a section and value`)
        .setColor(`Red`)
        .addField(`**__Available Sections__**,*name,country,timeZone,birthDay\naboutMe,flavoTtext,age,gender,dmfriendly,profilePictureLink\nfavoriteGames,profileColor,favoriteMusic,socialLinks\nzodiacName`,false)
    if (args.length <= 0)return message.channel.send((embed))
    var profiletarget = args[0].toLowerCase()
    var inputdata = args.join(" ").slice(profiletarget.length).split(",")
        const connect = function() {
            poolQuery(`SELECT * FROM socialprofile WHERE userid = '${message.author.id}'`).then(result => {
                if (Object.keys(result).length == 0){
                    poolQuery(`INSERT INTO socialprofile (userid) VALUES ('${message.author.id}')`).then(() => {
                        connect();
                    });
                } else {
                    poolQuery(`UPDATE socialprofile SET ${profiletarget} = "${inputdata}" WHERE userId='${message.author.id}'`).then(() => {
                        message.channel.send(`Your ${profiletarget} has been updated to \`${inputdata}\`.`)     
                    }).catch(() => {
                        const embed = new Discord.RichEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL)
                            .setTitle(`Unknown Profile Section`)
                            .setDescription(`Please check to ensure this is a correct profile section`)
                            .setColor(`RED`);
                        message.channel.send({embed});
                    });
                }        
            })
        }
        connect()
}

exports.infos = {
    category: "Settings",
    description: "Used to Change / Set your profile Info",
    usage: "\`&setprofile <section> <input>\`",
    example: "\`&setprofile aboutme this will show in About Me Section\`"
}