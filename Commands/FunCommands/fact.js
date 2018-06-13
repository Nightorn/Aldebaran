exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
    message.delete().catch(O_o=>{});
    async function fact() {
        const data = (await neko.getSFWFact());
        message.channel.send({embed:{
            author:{
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            title: (`The fact is....`),
            description: (`*${data.fact}*`),
            timestamp: new Date(),
            footer: {
                icon_url: bot.avatarURL,
                text: "Powerd By Nekos.life"
            }
            
        }});
    }
    fact();
}