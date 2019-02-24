const { MessageEmbed } = require("discord.js");
exports.run = async function(bot, message, args) {
    var userId = message.author.id;
    if (args.length > 0) {
        if (message.mentions.users.size > 0) {
            userId = message.mentions.users.first().id;
        } else {
            userId = args[0];
        }
    }
    bot.users.fetch(userId).then(user => {
        const profile = user.profile;
        if (profile.existsInDB) {
            var userDetails = "";
            if (profile.name !== null) userDetails += `**Name**: ${profile.name}\n`;
            if (profile.country !== null) userDetails += `**Country**: ${profile.country}\n`;
            if (profile.timezone !== null) userDetails += `**Timezone**: ${profile.timezone}\n`;
            if (profile.birthday !== null) userDetails += `**Birthday**: ${profile.birthday}\n`;
            if (profile.zodiacName !== null) userDetails += `**Zodiac Sign**: ${profile.zodiacName}\n`;
            if (profile.age !== null) userDetails += `**Age**: ${profile.age}\n`;
            if (profile.gender !== null) userDetails += `**Gender**: ${profile.gender}\n`;
            const embed = new MessageEmbed()
                .setAuthor(`${user.username}\'s Profile`, user.avatarURL())
                .setColor(profile.profileColor)
                .setFooter(`${/yes/i.test(profile.dmFriendly) ? "My DMs are open." : "My DMs are not open."} | Currently has ${profile.fortunePoints} Fortune points.`)
            if (profile.profilePictureLink !== null) embed.setImage(`${profile.profilePictureLink}`);
            if (profile.flavorText !== null) embed.setDescription(profile.flavorText);
            if (userDetails !== "") embed.addField(`__**User Details**__`, userDetails, true);
            if (profile.aboutMe !== null) embed.addField(`__**About me**__`, profile.aboutMe, true);
            if (profile.favoriteGames !== null) embed.addField(`__**Favorite Game(s)**__`, profile.favoriteGames, true);
            if (profile.favoriteMusic !== null) embed.addField(`__**Favorite Music(s)/Artist(s)**__`, profile.favoriteMusic, true);
            if (profile.socialLinks !== null) embed.addField(`__**Social Network(s) Link**__`, profile.socialLinks, true);
            message.channel.send({embed});
        } else {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setTitle(`No Profile Found`)
                .setDescription(`Please use \`${message.guild.prefix}setprofile name <yournamehere>\` to create your profile`)
                .setColor(`RED`);
            message.channel.send({embed});
        }
    }).catch(() => {
        message.reply('the user specified does not exist.');
    });
}

exports.infos = {
    category: "General",
    description: "Shows your Aldebaran's profile",
    usage: "\`&profile\`",
    example: "\`&profile\`",
}