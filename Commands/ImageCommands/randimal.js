exports.run = (bot, message, args) => {
    const request = require(`request`)
    const Discord = require(`discord.js`)
    const config = require(`./../../config.json`)
    var randomnumber = Math.floor((Math.random() * 5749) + 1)
    request({uri: `https://api.pexels.com/v1/search?query=animal+query&per_page=1&page=${randomnumber}`,headers: {"Authorization":config.pexels_apikey}}, function (err, response, body) {
        if (err) return message.channel.send("The seems to be a problem")
        var data = JSON.parse(body)
        var image = data.photos[0].src.large
        var imagesource = data.photos[0].photographer
        const embed = new Discord.RichEmbed()
        .setTitle(`**__Virtual Safari__**`)
        .setAuthor(message.author.username,message.author.avatarURL)
        .setColor(0x00AE86)
        .setImage(`${image}`)
        .setFooter(`Virtual Safari Powered By: ${imagesource} on Pexels.com`)
        message.channel.send({embed})
    })
}
exports.infos = {
    category: "Image",
    description: "Displays a random animal picture or gif. ",
    usage: "\`&randimal\`",
    example: "\`&randimal\`",
}