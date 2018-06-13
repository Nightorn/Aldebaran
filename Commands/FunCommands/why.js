exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
    message.delete().catch(O_o=>{});
    async function question() {
        const data = (await neko.getSFWWhy());
        message.channel.send({embed:{
            author:{
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            title: (`Did you ever wonder....`),
            description: (`*${data.why}*`),
            timestamp: new Date(),
            footer: {
                icon_url: bot.avatarURL,
                text: "Powerd By Nekos.life"
            }
            
        }});
    }
    question();
}