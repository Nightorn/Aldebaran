exports.run = (client, message, args) => {
    const request = require(`request`)
    const Discord = require(`discord.js`)

    request({uri: `http://random.birb.pw/tweet.json/`}, function (err, response, body) {
        if (err) return message.channel.send("The seems to be a birb problem")
        const data = JSON.parse(body);
        var imagefile = data.file
        var imageurl = `http://random.birb.pw/img/${imagefile}`
        const embed = new Discord.RichEmbed()
            .setTitle(`You want some __Birb__?`)
            .setAuthor(message.author.username,message.author.avatarURL)
            .setColor(0x00AE86)
            .setImage(`${imageurl}`)
            .setFooter(`Birb powered by http://random.brib.pw`)
        message.channel.send({embed})        
    })    
}