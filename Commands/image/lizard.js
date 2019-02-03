exports.run = async (bot, message, args) => {
    const client = require('nekos.life');
    const neko = new client();
    const data = await neko.getSFWLizard();
    message.channel.send({embed:{
        author:{
            name: message.author.username,
            icon_url: message.author.avatarURL()
        },
        description: `***We're off to see the lizard, the wonderful lizard of Oz!***`,
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
    description: "Displays a random lizard picture or gif.",
    usage: "\`&lizard\`",
    example: "\`&lizard\`",
}