exports.run = (bot, message, args) => {
    const request = require(`request`)
    const { MessageEmbed } = require(`discord.js`)
    var randomnumber = Math.floor((Math.random() * 5749) + 1);
    request({uri: `https://api.pexels.com/v1/search?query=animal+query&per_page=1&page=${randomnumber}`,headers: {"Authorization":bot.config.pexels_apikey}}, function (err, response, body) {
        if (err) return message.channel.send("This seems to be a problem")
        var data = JSON.parse(body).photos[0];
        const embed = new MessageEmbed()
        .setTitle(`**__Virtual Safari__**`)
        .setAuthor(message.author.username, message.author.avatarURL())
        .setColor(0x00AE86)
        .setImage(data.src.large)
        .setFooter(`Virtual Safari Powered By: ${data.photographer} on Pexels.com`)
        message.channel.send({embed})
    })
}
exports.infos = {
    category: "Image",
    description: "Displays a random animal picture or gif. ",
    usage: "\`&randimal\`",
    example: "\`&randimal\`",
}