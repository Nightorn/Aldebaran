exports.run = (bot, message, args) => {
    const request = require(`request`)
    const Discord = require(`discord.js`)
    const config = require(`./../../config.json`)
    var ducknumber = Math.floor((Math.random() * 162) + 1)
    request({uri: `https://api.pexels.com/v1/search?query=duck+query&per_page=1&page=${ducknumber}`,headers: {"Authorization":config.pexels_apikey}}, function (err, response, body) {
        if (err) return message.channel.send("The seems to be a ducking problem")
        var data = JSON.parse(body)
        var image = data.photos[0].src.large
        var imagesource = data.photos[0].photographer
        const embed = new Discord.RichEmbed()
        .setTitle(`**__Quack Quack__**`)
        .setAuthor(message.author.username,message.author.avatarURL)
        .setColor(0x00AE86)
        .setImage(`${image}`)
        .setFooter(`Duck Powered By: ${imagesource} on Pexels.com`)
        message.channel.send({embed})
    })
}
exports.infos = {
    category: "Image",
    description: "Displays a random duck picture or gif. ",
    usage: "\`&duck\`",
    example: "\`&duck\`",
}