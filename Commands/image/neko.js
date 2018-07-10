exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
        let target = message.mentions.users.first();
        async function nekos() {
            const data = (await neko.getSFWNeko());
            message.channel.send({embed:{
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                description: (`${message.author}\nHere is your innocent Neko.`),
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
        nekos();
    }
    exports.infos = {
        category: "Image",
        description: "Displays a random neko picture or gif. ",
        usage: "\`&neko\`",
        example: "\`&neko\`",
    }