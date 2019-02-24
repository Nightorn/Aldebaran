exports.run = (bot, message, args) => {
    const request = require(`request`);
    const { MessageEmbed } = require(`discord.js`);
    var ducknumber = Math.floor((Math.random() * 162) + 1);
    request({uri: `https://api.pexels.com/v1/search?query=duck+query&per_page=1&page=${ducknumber}`,headers: {"Authorization":bot.config.pexels_apikey}}, function (err, response, body) {
        var parsed = JSON.parse(body);
        if (err) return message.channel.send("The seems to be a ducking problem");
        if (data.error) return message.channel.send(`Someone has requested too many ducks recently, the only thing you can do is waiting for your turn!`);
        var data = parsed.photos[0];
        const embed = new MessageEmbed()
            .setTitle(`**__Quack Quack__**`)
            .setAuthor(message.author.username,message.author.avatarURL())
            .setColor(0x00AE86)
            .setImage(data.src.large)
            .setFooter(`Duck Powered By: ${data.photographer} on Pexels.com`)
        message.channel.send({embed})
    });
}
exports.infos = {
    category: "Image",
    description: "Quack Quack",
    usage: "\`&duck\`",
    example: "\`&duck\`",
}