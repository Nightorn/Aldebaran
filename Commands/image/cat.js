exports.run = (bot, message, args) => {
    const request = require(`request`)
    const Discord = require(`discord.js`)
    const config = require(`${process.cwd()}/config.json`)
    const parser = require("xml2js")

    request({uri: `http://thecatapi.com/api/images/get?api_key=${config.cat_apikey}&format=xml&results_per_page=1`}, function (err, response, body) {
        if (err) return message.channel.send("The seems to be a birb problem")
        var data = (body)
        parser.parseString(data, function (err, result) {
            var image = result.response.data[0].images[0].image[0].url[0]
            var imagesource = result.response.data[0].images[0].image[0].source_url[0]
            const embed = new Discord.RichEmbed()
            .setTitle(`**__Here kitty kitty!__**`)
            .setAuthor(message.author.username,message.author.avatarURL)
            .setColor(0x00AE86)
            .setImage(`${image}`)
            .setFooter(`Cat Powered By: ${imagesource}`)
            message.channel.send({embed})
        })
    })
}
exports.infos = {
    category: "Image",
    description: "Displays a random cat picture or gif. ",
    usage: "\`&cat\`",
    example: "\`&cat\`",
}