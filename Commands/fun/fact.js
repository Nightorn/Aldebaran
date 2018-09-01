exports.run = async (bot, message, args) => {
    const client = require('nekos.life');
    const neko = new client();
    message.delete().catch(O_o=>{});
    const data = (await neko.getSFWFact());
    message.channel.send({embed:{
        author:{
            name: message.author.username,
            icon_url: message.author.avatarURL()
        },
        title: (`The fact is....`),
        description: (`*${data.fact}*`),
        timestamp: new Date(),
        footer: {
            icon_url: bot.user.avatarURL(),
            text: "Powerd By Nekos.life"
        }
    }});
}
exports.infos = {
    category: "Fun",
    description: "Get a random fact!",
    usage: "\`&fact\`",
    example: "\`&fact\`"
}
