const { MessageEmbed } = require('discord.js');
exports.run = (bot, message) => {
    const embed = new MessageEmbed()
        .setTitle(`List of the People who contributed, in any way, to the development of Aldebaran`)
        .addField(`Development Team`, `**\`[Nightmare#1666]\`** Project Leader\n**\`[Ciborn#2844]\`** Developer`)
        .addField(`Support Team`, `**\`[Ryudragon98#0946]\`** Support`)
        .addField(`Other Contributions`, `**\`[Akashic Bearer#2305]\`** Development Help\n**\`[PlayTheFallen#8318]\`** Development Help\n**\`[mount2010#9649]\`** Ex-Developer`)
        .setColor(`PURPLE`);
    message.channel.send({embed});
}

exports.infos = {
    category: "General",
    description: "Lists the people who contributed",
    usage: "\`&credits\`",
    example: "\`&credits\`"
}