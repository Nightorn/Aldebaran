exports.run = (bot, message, args) => {
    const request = require(`request`);
    const { MessageEmbed } = require(`discord.js`);
    var bunnynumber = Math.floor((Math.random() * 28) + 1);
    request({uri: `https://api.pexels.com/v1/search?query=bunny+query&per_page=1&page=${bunnynumber}`,headers: {"Authorization":bot.config.pexels_apikey}}, function (err, response, body) {
        if (err) return message.channel.send("This seems to be a bunny problem");
        var data = JSON.parse(body);
        const embed = new MessageEmbed()
            .setTitle(`**__Where's My Carrot?__**`)
            .setAuthor(message.author.username,message.author.avatarURL())
            .setColor(0x00AE86)
            .setImage(data.photos[0].src.large)
            .setFooter(`Bunny Powered By: ${data.photos[0].photographer} on Pexels.com`)
        message.channel.send({embed});
    });
}
exports.infos = {
    category: "Image",
    description: "Displays a random bunny picture or gif. ",
    usage: "\`&bunny\`",
    example: "\`&bunny\`",
}