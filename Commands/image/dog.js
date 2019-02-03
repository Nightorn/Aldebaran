exports.run = (bot, message, args) => {
    const request = require(`request`)
    const { MessageEmbed } = require(`discord.js`);
    request({uri: `https://dog.ceo/api/breeds/image/random`} , function (err, response, body) {
        if (err) return message.channel.send("There seems to be a doggo problem.");
        const embed = new MessageEmbed()
            .setTitle(`**__Woof Woof__**`)
            .setAuthor(message.author.username,message.author.avatarURL())
            .setColor(0x00AE86)
            .setImage(JSON.parse(body).message)
            .setFooter(`Doggo Powered By: http://dog.ceo`)
        message.channel.send({embed});
    });
}
exports.infos = {
    category: "Image",
    description: "WoooOOF",
    usage: "\`&dog\`",
    example: "\`&dog\`",
}