exports.run = (bot, message, args) => {
    const request = require(`request`)
    const Discord = require(`discord.js`)
    const config = require(`${process.cwd()}/config.json`)
    var bunnynumber = Math.floor((Math.random() * 28) + 1)
    request({uri: `https://api.pexels.com/v1/search?query=bunny+query&per_page=1&page=${bunnynumber}`,headers: {"Authorization":config.pexels_apikey}}, function (err, response, body) {
        if (err) return message.channel.send("The seems to be a bunny problem")
        var data = JSON.parse(body)
        var image = data.photos[0].src.large
        var imagesource = data.photos[0].photographer
        const embed = new Discord.RichEmbed()
        .setTitle(`**__Where's My Carrot?__**`)
        .setAuthor(message.author.username,message.author.avatarURL)
        .setColor(0x00AE86)
        .setImage(`${image}`)
        .setFooter(`Bunny Powered By: ${imagesource} on Pexels.com`)
        message.channel.send({embed})
    })
}
exports.infos = {
    category: "Image",
    description: "Displays a random bunny picture or gif. ",
    usage: "\`&bunny\`",
    example: "\`&bunny\`",
}