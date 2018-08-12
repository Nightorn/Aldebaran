exports.run = (bot, message, args) => {
    const Discord = require("discord.js");
    message.channel.send({"embed": {
        "title": "Invite Links",
        "description": "[__**Add Bot To Your Server**__](https://discordapp.com/api/oauth2/authorize?client_id=437802197539880970&permissions=126016&scope=bot)\n*Let the fun commands start*\n[__**Join Support Server**__](https://discord.gg/3x6rXAv)\n*Stay updated with the newest features and commands*", 
        "footer": {"text": "In Development By Nightmare#1234"}
      }})
}
exports.infos = {
    category: "General",
    description: "Displays Bot & Server Invite",
    usage: "\`&invite\`",
    example: "\`&invite\`"
}
