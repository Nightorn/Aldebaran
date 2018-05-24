exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed()
        .setTitle("Aldebaran's Help")
        .setAuthor("Author")
        .setDescription("You can find a list of my functions and how to use them below.")
        .addField("__😄 Avatar 😄__ - **&Avatar <mention>**","Description: Using will display avatar of mentioned member.",false)
        .addField("__⚔ Stats ⚔__ - **&Stats <mention> or ID**","Description: Using will display DRPG detailed stats for the user or ID mentioned",false)
        .addField("__🎥 Actions 🎥__ - &<action> <mention>","Description:Using the below `actions` with ping will display gif with mentioned member.\n**Actions:** Adorbs, Bite, Cuddle, Hug, Kidnap, Kiss, Lick, Tackle,\nSlap, Spank",false)
        .addField("__Add Me To Your Server__","You can add me to your server with the link below\nhttps://discordapp.com/oauth2/authorize?client_id=437802197539880970&scope=bot&permissions=8",false)
        .setFooter("In Development By Nightmare#1234")
        .setTimestamp ()
            message.channel.send({embed});
}
