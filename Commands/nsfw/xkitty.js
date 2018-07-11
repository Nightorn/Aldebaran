exports.run = async (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
    let target = message.mentions.users.first();
    const data = await neko.getNSFWPussy();
    message.channel.send({embed:{
        author:{
            name: message.author.username,
            icon_url: message.author.avatarURL
        },
        description: (message.author + " " + `Yup thats a kitty.`),
        image: {
            url : (data.url),
        },
        timestamp: new Date(),
        footer: {
            icon_url: bot.avatarURL,
            text: "Powered By Nekos.life"
        }
    }});
}
exports.infos = {
    category: "NSFW",
    description: "Displays a hentai picture or gif containing \"Kitty\". ",
    usage: "\`&xkitty\`",
    example: "\`&kitty\`",
    restrictions: "NSFW Channels Only"
}