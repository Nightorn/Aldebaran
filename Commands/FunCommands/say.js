exports.run = (bot, message, args) => {
   const sayMessage = args.join(" ");
   message.delete().catch(O_o=>{});
   message.channel.send({embed:{
        author:{
        name: bot.user.username,
        icon_url: bot.user.avatarURL
        },
        title: (sayMessage),
        timestamp: new Date()
    
    }})
};
exports.infos = {
    "category": "Fun",
    "description": "",
    "usage": ""
}
