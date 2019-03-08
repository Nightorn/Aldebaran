const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
exports.run = function(bot, message, args) {
    const availableSections = ["name", "country", "timezone", 'birthday', "profilePictureLink", "favoriteGames", "profileColor", "favoriteMusic", "socialLinks", "zodiacName"];
    const embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`Please specify a section and value`)
        .setColor(`Red`)
        .addField(`**__Available Sections__**`, `${availableSections.join(" | ")}`, false)
    if (args.length <= 0) return message.channel.send((embed));

    var profiletarget = args[0].toLowerCase();
    var inputdata = args.join(" ").slice(profiletarget.length);

    message.author.profile.changeProperty(profiletarget, inputdata).then(() => {
        message.channel.send(`Your ${profiletarget} has been updated to \`${inputdata}\`.`);
    }).catch(() => {
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle(`Unknown Profile Section`)
            .setDescription(`Please check to ensure this is a correct profile section. If you think the specified profile section was valid, please make sure the value is too.`)
            .setColor(`RED`);
        message.channel.send({embed});
    });
}

exports.infos = {
    category: "Settings",
    description: "Used to Change / Set your profile Info",
    usage: "\`&setprofile <section> <input>\`",
    example: "\`&setprofile aboutme this will show in About Me Section\`"
}