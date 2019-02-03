exports.run = (bot, message, args) => {
    const request = require(`request`);
    const { MessageEmbed } = require(`discord.js`);
    const parser = require("xml2js");
    request({uri: `http://thecatapi.com/api/images/get?api_key=${bot.config.cat_apikey}&format=xml&results_per_page=1`}, function (err, response, data) {
        if (err) return message.channel.send("This seems to be a birb problem");
        parser.parseString(data, function(err, result) {
            result = result.response.data[0].images[0].image[0];
            const embed = new MessageEmbed()
                .setTitle(`**__Here kitty kitty!__**`)
                .setAuthor(message.author.username,message.author.avatarURL())
                .setColor(0x00AE86)
                .setImage(result.url[0])
                .setFooter(`Cat Powered By: ${result.source_url[0]}`)
            message.channel.send({embed});
        })
    })
}
exports.infos = {
    category: "Image",
    description: "Meowwwwwwwwwww",
    usage: "\`&cat\`",
    example: "\`&cat\`",
}