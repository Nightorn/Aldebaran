exports.run = (bot, message, args) => {
    const request = require(`request`)
    const Discord = require(`discord.js`)
    const config = require(`${process.cwd()}/config.json`)
    var hedgenumber = Math.floor((Math.random() * 31) + 1)
    request({uri: `https://api.pexels.com/v1/search?query=hedgehog+query&per_page=1&page=${hedgenumber}`,headers: {"Authorization":config.pexels_apikey}}, function (err, response, body) {
        if (err) return message.channel.send("There seems to be a prickly problem")
        var data = JSON.parse(body)
        var image = data.photos[0].src.large
        var imagesource = data.photos[0].photographer
        const embed = new Discord.RichEmbed()
        .setTitle(`**__Aww look so...OUCH that hurt!__**`)
        .setAuthor(message.author.username,message.author.avatarURL)
        .setColor(0x00AE86)
        .setImage(`${image}`)
        .setFooter(`Hedgehog Powered By: ${imagesource} on Pexels.com`)
        message.channel.send({embed})
    })
}
exports.infos = {
    category: "Image",
    description: "Displays a random hedgehog picture or gif. ",
    usage: "\`&hedgehog\`",
    example: "\`&hedgehog\`",
}