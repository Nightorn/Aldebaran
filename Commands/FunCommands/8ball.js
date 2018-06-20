const client = require('nekos.life');
const Discord = require(`discord.js`)
exports.run = (bot, message, args) => {
    const neko = new client();
    if(args =! ''){
        async function ball() {
            const data = (await neko.getSFW8Ball());
            message.channel.send({embed:{
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                description: (`**${data.response}**`),
                image: {
                    url : (data.url),
                },
                timestamp: new Date(),
                footer: {
                    icon_url: bot.avatarURL,
                    text: "Powerd By Nekos.life"
                }
            
            }});
        }
        ball();
        
    } else {
        message.reply("Please ask a question")
    }
}
exports.infos = {
    "category": "Fun",
    "description": "Ask the magic 8ball a question, get it's all knowing answer",
    "usage": "&8ball Why is the sky blue?"
}
