exports.run = (bot, message, args) => {
    const request = require(`request`)
    const { MessageEmbed } = require(`discord.js`);
    request({uri: `https://random.dog/woof.json`} , function (err, response, body) {
        if (err) return message.channel.send("There seems to be a dogo problem");
        const embed = new MessageEmbed()
            .setTitle(`**__Woof Woof__**`)
            .setAuthor(message.author.username,message.author.avatarURL())
            .setColor(0x00AE86)
            .setImage(JSON.parse(body).url)
            .setFooter(`Dogo Powered By: http://random.dog`)
        message.channel.send({embed});
    });
}
exports.infos = {
    category: "Image",
    description: "Displays a random dog picture or gif. ",
    usage: "\`&dog\`",
    example: "\`&dog\`",
}