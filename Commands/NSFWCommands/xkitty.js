exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
    if(message.channel.nsfw === true) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        async function vag() {
            const data = (await neko.getNSFWPussy());
            message.channel.send({embed:{
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                description: (message.author + " " + `Yup thats a kitty.`),
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
        vag();
        
    } else {
        message.reply("Tsk tsk! This command is only usable in a NSFW channel.")
    }
}