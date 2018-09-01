exports.run = async (bot, message, args) => {
    const client = require('nekos.life');
    const neko = new client();
    const data = await neko.getNSFWRandomHentaiGif();
    message.channel.send({embed:{
        author:{
            name: message.author.username,
            icon_url: message.author.avatarURL()
        },
        description: message.author + " " + ` You wanted random...here you go!`,
        image: {
            url : (data.url),
        },
        timestamp: new Date(),
        footer: {
            icon_url: bot.user.avatarURL(),
            text: "Powered By Nekos.life"
        }
    }});
}
exports.infos = {
    category: "NSFW",
    description: "Displays a random hentai picture or gif. ",
    usage: "\`&xrandom\`",
    example: "\`&random\`",
    restrictions: "NSFW Channels Only",
    nsfw: true
}