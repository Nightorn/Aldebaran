exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed()
        .setTitle("Aldebaran's Help")
        .setAuthor("Author")
        .setDescription("You can find a list of my functions and how to use them below.")
        .addField("__🖼 Gif 🖼__ - **&Gif<searchterm>**","Description: Using will return a gif matching your search term.\n\n",false)
        .addField("__🚶 Avatar 🚶__ - **&Avatar <mention>**","Description: Using will display avatar of mentioned member.",false)
        .addField("Stats","Field Descript",false)
        .addField("Field Title","Field Descript",false)
        .addField("Field Title","Field Descript",false)
        .addField("Field Title","Field Descript",false)
        .setFooter("In Development By Nightmare#1234")
        .setTimestamp ()
            message.channel.send({embed});
}
