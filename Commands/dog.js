exports.run = (bot, message, args) => {
    const request = require(`request`)
    const Discord = require(`discord.js`)
    const config = require(`./../config.json`)
    request({uri: `https://random.dog/woof.json`} , function (err, response, body) {
        if (err) return message.channel.send("There seems to be a dogo problem")
        const data = JSON.parse(body)
        var image = data.url
        const embed = new Discord.RichEmbed()
        
        .setTitle(`**__Woof Woof__**`)
        .setAuthor(message.author.username,message.author.avatarURL)
        .setColor(0x00AE86)
        .setImage(`${image}`)
        .setFooter(`Dogo Powered By: http://random.dog`)
        message.channel.send({embed})

    });
}