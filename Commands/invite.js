exports.run = (bot, message, args) => {
    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed()
        .setTitle("Add Me To Your Server")
        .addField("__Link__","http://tiny.cc/aldebaran",false)
        .setFooter("In Development By Nightmare#1234")
        .setTimestamp ()
    message.channel.send({embed});
}
