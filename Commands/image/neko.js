exports.run = async (bot, message, args) => {
    const client = require('nekos.life');
    const neko = new client();
    const data = await neko.getSFWNeko();
    message.channel.send({embed:{
        author:{
            name: message.author.username,
            icon_url: message.author.avatarURL()
        },
        description: `${message.author}\nHere is your innocent Neko.`,
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
    category: "Image",
    description: "Displays a random neko picture or gif. ",
    usage: "\`&neko\`",
    example: "\`&neko\`",
}