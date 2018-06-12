exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();

        async function lizard() {
            const data = (await neko.getSFWLizard());
            message.channel.send({embed:{
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                description: (`***Where off to see the lizard, the wonderful lizard of Oz!***`),
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
    lizard(); 
}