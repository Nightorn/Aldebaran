const client = require('nekos.life');
exports.run = async (bot, message, args) => {
    const neko = new client();
    if(args =! ''){
        const data = (await neko.getSFW8Ball());
        message.channel.send({embed:{
            author:{
                name: message.author.username,
                icon_url: message.author.avatarURL()
            },
            description: (`**${data.response}**`),
            image: {
                url : (data.url),
            },
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL(),
                text: "Powerd By Nekos.life"
            }
        
        }});
        
    } else {
        message.reply("Please ask a question")
    }
}
exports.infos = {
    category: "Fun",
    description: "Ask the magic 8ball a question, get it's all knowing answer",
    usage: "\`&8ball <question>\`",
    example: "\`&8ball will the grass be red today?\`"
}
