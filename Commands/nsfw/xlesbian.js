exports.run = async (bot, message, args) => {
    const client = require('nekos.life');
    const neko = new client();
    const data = await neko.getNSFWLesbian();
    message.channel.send({embed:{
        author:{
            name: message.author.username,
            icon_url: message.author.avatarURL()
        },
        description: message.author + " " + ` LEZ be Honest!`,
        image: {
            url : data.url,
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
    description: "Displays a lesbian hentai animated picture or gif.",
    usage: "\`&xlesbian\`",
    example: "\`&xlesbian\`",
    restrictions: "NSFW Channels Only",
    nsfw: true
}