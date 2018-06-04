exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed()
        .setTitle("Add Me To Your Server")
        .setAuthor("Author")
        .addField("__Link__","https://discordapp.com/oauth2/authorize?client_id=437802197539880970&scope=bot&permissions=8",false)
        .setFooter("In Development By Nightmare#1234")
        .setTimestamp ()
    message.channel.send({embed});
}
