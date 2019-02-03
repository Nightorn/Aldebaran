exports.run = (bot, message, args) => {
    const request = require(`request`);
    const Discord = require(`discord.js`);
    var hedgenumber = Math.floor((Math.random() * 31) + 1);
    request({uri: `https://api.pexels.com/v1/search?query=hedgehog+query&per_page=1&page=${hedgenumber}`,headers: {"Authorization":bot.config.pexels_apikey}}, function (err, response, body) {
        if (err) return message.channel.send("There seems to be a prickly problem");
        var data = JSON.parse(body).photos[0];
        const embed = new Discord.MessageEmbed()
        .setTitle(`**__Aww look so...OUCH that hurt!__**`)
        .setAuthor(message.author.username,message.author.avatarURL())
        .setColor(0x00AE86)
        .setImage(data.src.large)
        .setFooter(`Hedgehog Powered By: ${data.photographer} on Pexels.com`)
        message.channel.send({embed})
    })
}
exports.infos = {
    category: "Image",
    description: "Huff Huff Huff",
    usage: "\`&hedgehog\`",
    example: "\`&hedgehog\`",
}