const { MessageEmbed } = require("discord.js");
exports.run = function(bot, message, args) {
    var userid = message.author.id;
    var title = message.author.username;
    var useravatar = message.author.avatarURL()
    
    if (args.length > 0) {
        userid = message.mentions.members.size > 0 ? message.mentions.users.first().id : args[0];
        user = message.mentions.users.first()
        title = user.username
        useravatar = user.avatarURL()
    };

    const profile = message.author.profile;
    if (message.author.profile.existsInDB) {
        const embed = new MessageEmbed()
            .setTitle(`${title}\'s Profile`)
            .setDescription(`${profile.flavorText}`)
            .setColor(`${profile.profileColor}`)
            .addField(`**__User Details__**`,`**Name:** ${profile.name}\n**Country:** ${profile.country}\n**Timezone:** ${profile.timezone}\n**Birthday:** ${profile.birthday}\n**Zodiac Sign:** ${profile.zodiacName}\n**Age:** ${profile.age}\n**Gender**: ${profile.gender}`,true)
            .addField(`**__About Me__**`,`${profile.aboutMe}`,false)
            .addField(`__**Favorite Game**__`,`${profile.favoriteGames}`,true)
            .addField(`__**Favorite Music**__`,`${profile.favoriteMusic}`,true)
            .addField(`__**Social Media Links**__`,`${profile.socialLinks}`,false)
            .setThumbnail(useravatar)
            .setFooter(`${/yes/i.test(profile.dmFriendly) ? "My DMs are open." : "My DMs are not open."} | Currently has ${profile.fortunePoints} Fortune points.`)
        if(`${profile.profilePictureLink}` !== "null") embed.setImage(`${profile.profilePictureLink}`);
        message.channel.send({embed});
    } else {
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle(`No Profile Found`)
            .setDescription(`Please use \`&setprofile name <yournamehere>\` to create your profile`)
            .setColor(`RED`);
        message.channel.send({embed});
    }
}

exports.infos = {
    category: "General",
    description: "Shows your Aldebaran's profile",
    usage: "\`&profile\`",
    example: "\`&profile\`",
}