exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        async function pat() {
            const data = (await neko.getSFWPat());
            message.channel.send({embed:{
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                description: (message.author +`  loves patting `+ target),
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
        pat();
        
    } else {
        message.reply("Please mention someone :thinking:")
    }
}
exports.infos = {
    category: "Action",
    description: "Performs Action On Mentioned User & Displays Gif To Accompany",
    usage: "\`&pat<usermention>\`",
    example: "\`&pat @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}