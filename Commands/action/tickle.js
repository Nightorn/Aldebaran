exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        async function tickle() {
            const data = (await neko.getSFWTickle());
            message.channel.send({embed:{
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                description: (message.author +` won't stop tickling  `+ target),
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
        tickle();
        
    } else {
        message.reply("Please mention someone :thinking:")
    }
}
exports.infos = {
    category: "Action",
    description: "Performs Action On Mentioned User & Displays Gif To Accompany",
    usage: "\`&tickle <usermention>\`",
    example: "\`&tickle @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}