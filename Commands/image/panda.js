exports.run = (bot, message, args) => {
    const request = require(`request`)
    const Discord = require(`discord.js`)
    const config = require(`./../../config.json`)
    var pandanumber = Math.floor((Math.random() * 52) + 1)
    request({uri: `https://api.pexels.com/v1/search?query=panda+query&per_page=1&page=${pandanumber}`,headers: {"Authorization":config.pexels_apikey}}, function (err, response, body) {
        if (err) return message.channel.send("There seems to be a prickly problem")
        var data = JSON.parse(body)
        var image = data.photos[0].src.large
        var imagesource = data.photos[0].photographer
        const embed = new Discord.RichEmbed()
        .setTitle(`**__Panda Panda Panda__**`)
        .setAuthor(message.author.username,message.author.avatarURL)
        .setColor(0x00AE86)
        .setImage(`${image}`)
        .setFooter(`Panda Powered By: ${imagesource} on Pexels.com`)
        message.channel.send({embed})
    })
}
exports.infos = {
    category: "Image",
    description: "Displays a random panda picture or gif. ",
    usage: "\`&panda\`",
    example: "\`&panda\`",
}