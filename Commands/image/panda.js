exports.run = (bot, message, args) => {
    const request = require(`request`);
    const { MessageEmbed } = require(`discord.js`);
    var pandanumber = Math.floor((Math.random() * 52) + 1);
    request({uri: `https://api.pexels.com/v1/search?query=panda+query&per_page=1&page=${pandanumber}`,headers: {"Authorization":bot.config.pexels_apikey}}, function (err, response, body) {
        if (err) return message.channel.send("There seems to be a prickly problem")
        var data = JSON.parse(body).photos[0];
        const embed = new MessageEmbed()
            .setTitle(`**__Panda Panda Panda__**`)
            .setAuthor(message.author.username,message.author.avatarURL())
            .setColor(0x00AE86)
            .setImage(data.src.large)
            .setFooter(`Panda Powered By: ${data.photographer} on Pexels.com`)
        message.channel.send({embed})
    })
}
exports.infos = {
    category: "Image",
    description: "Displays a random panda picture or gif.",
    usage: "\`&panda\`",
    example: "\`&panda\`",
}