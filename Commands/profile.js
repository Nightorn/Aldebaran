const poolQuery = require('./../functions/database/poolQuery');
const config = require("./../config.json");
const Discord = require("discord.js");
const mysql = require("mysql");
exports.run = function(bot, message, args) {
    
    var userid = message.author.id;
    var title = message.author.username;
    var useravatar = message.author.avatarURL
    
    if(args.length > 0){
        userid = message.mentions.members.size > 0 ? message.mentions.users.first().id : args[0];
        user = message.mentions.users.first()
        title = user.username
        useravatar = user.avatarURL
    };

    const connect = function() {
        poolQuery(`SELECT * FROM socialprofile WHERE userId='${userid}'`).then(result => {
            let profile = result[0];
            const embed = new Discord.RichEmbed()
                .setTitle(`${title}\'s Profile`)
                .setDescription(`${profile.flavorText}`)
                .setColor(`${profile.profileColor}`)
                .addField(`**__User Details__**`,`**Name:** ${profile.name}\n**Country:** ${profile.country}\n**Timezone:** ${profile.timezone}\n**Birthday:** ${profile.birthday} | **Zodiac Sign:** ${profile.zodiacName}\n**Age:** ${profile.age}\n**Gender**: ${profile.gender}`,true)
                .addField(`**__About Me__**`,`${profile.aboutMe}`,false)
                .addField(`__**Favorite Game**__`,`${profile.favoriteGames}`,true)
                .addField(`__**Favorite Music**__`,`${profile.favoriteMusic}`,true)
                .addField(`__**Social Media Links**__`,`${profile.socialLinks}`,false)
                .setThumbnail(useravatar)
                .setFooter(`${profile.dmFriendly} My DM's Are Open. | Currently has ${profile.fortunePoints} Fortune points.`)
                if(`${profile.profilePictureLink}` !== "null"){
                    embed.setImage(`${profile.profilePictureLink}`)
                }
            message.channel.send(embed) 
        }).catch(() => {
            const embed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`An Error Occured`)
                .setDescription(`An error occured and we could not retrive your profile. Please retry later.`)
                .setColor(`RED`);
            message.channel.send({embed});
        })
    }
    connect()
}

exports.infos = {
    category: "General",
    description: "Shows your Aldebaran's profile",
    usage: "\`&profile\`",
    example: "\`&profile\`",
}