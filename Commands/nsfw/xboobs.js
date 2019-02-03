exports.run = async (bot, message) => {
    const client = require('nekos.life');
    const neko = new client();
    const data = await neko.getNSFWBoobs();
    message.channel.send({embed:{
        author:{
            name: message.author.username,
            icon_url: message.author.avatarURL()
        },
        description: (message.author + " " + `You want boobs?, I give you...BOOBS!`),
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
    description: "Displays a hentai picture or gif containing Boobs",
    usage: "\`&xboobs\`",
    example: "\`&xboobs\`",
    restrictions: "NSFW Channels Only",
    nsfw: true
}