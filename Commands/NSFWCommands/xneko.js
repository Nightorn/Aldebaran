exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
    if(message.channel.nsfw === true) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        async function xneko() {
            const data = (await neko.getNSFWNekoGif());
            message.channel.send({embed:{
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                description: (message.author + " " + `Here is your Naughty Neko.`),
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
        xneko();
        
    } else {
        message.reply("Tsk tsk! This command is only usable in a NSFW channel.")
    }
}
exports.infos = {
    category: "NSFW",
    description: "Displays a hentai Neko picture or gif. ",
    usage: "\`&xneko\`",
    example: "\`&neko\`",
    restrictions: "NSFW Channels Only"
}