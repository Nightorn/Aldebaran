exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed()
        .setTitle("Add Me To Your Server")
        .addField("__Link__","http://bit.do/aldebaranbot",false)
        .setFooter("In Development By Nightmare#1234")
        .setTimestamp ()
    message.channel.send({embed});
}
